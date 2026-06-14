# verify-postgres.ps1
# Reusable live smoke test for MediVault PostgreSQL mode, with an optional memory-mode pass.

param(
    [string]$BackendDir = "D:\CodeSentinal_Demo\medivault\backend",
    [string]$PostgresBaseUrl = "http://localhost:5000/api",
    [string]$MemoryBaseUrl = "http://localhost:5001/api",
    [switch]$SkipMemoryMode
)

$ErrorActionPreference = "Stop"

function Write-Step($Message) {
    Write-Host "[VERIFY] $Message" -ForegroundColor Cyan
}

function Invoke-Json($Uri, $Method, $Body = $null) {
    $params = @{
        Uri         = $Uri
        Method      = $Method
        ContentType = "application/json"
    }
    if ($null -ne $Body) {
        $params.Body = ($Body | ConvertTo-Json -Depth 10)
    }
    Invoke-RestMethod @params
}

function Start-Backend([string]$WorkingDirectory, [string]$StdOutLog, [string]$StdErrLog, [string[]]$EnvPairs) {
    if (Test-Path $StdOutLog) { Remove-Item -LiteralPath $StdOutLog -Force }
    if (Test-Path $StdErrLog) { Remove-Item -LiteralPath $StdErrLog -Force }

    $cmd = @()
    foreach ($pair in $EnvPairs) {
        $cmd += "set $pair"
    }
    $cmd += "node server.js > `"$StdOutLog`" 2> `"$StdErrLog`""
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c", ("cd /d `"$WorkingDirectory`" && " + ($cmd -join "&& ")) -WindowStyle Hidden | Out-Null
}

function Wait-ForHealth([string]$BaseUrl, [int]$TimeoutSeconds = 20) {
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        try {
            $health = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get
            if ($health.ok) {
                return $health
            }
        } catch {
            Start-Sleep -Milliseconds 500
        }
    } while ((Get-Date) -lt $deadline)

    throw "Backend health check failed for $BaseUrl"
}

function Stop-NodeBackends {
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

function Test-Mode([string]$BaseUrl, [string]$ModeName) {
    Write-Step "Testing $ModeName mode against $BaseUrl"

    $stamp = (Get-Date).ToString("yyyyMMddHHmmss")
    $email = "$($ModeName.ToLower())$stamp@example.com"
    $patientEmail = "patient$stamp@example.com"

    $register = Invoke-Json "$BaseUrl/auth/register" "Post" @{
        name     = "$ModeName Test"
        email    = $email
        password = "password123"
        role     = "patient"
    }

    $login = Invoke-Json "$BaseUrl/auth/login" "Post" @{
        email    = $email
        password = "password123"
    }

    $patient = Invoke-Json "$BaseUrl/patients" "Post" @{
        name             = "$ModeName Patient"
        email            = $patientEmail
        password         = "password123"
        age              = 41
        blood_group      = "A+"
        phone            = "555-2002"
        insurance_number = "INS-$ModeName-2002"
    }

    $patientUpdate = Invoke-Json "$BaseUrl/patients/$($patient.id)" "Put" @{
        age   = 42
        phone = "555-3003"
    }

    $record = Invoke-Json "$BaseUrl/records" "Post" @{
        patient_id   = $patient.id
        doctor_id    = 1
        diagnosis    = "$ModeName diagnosis"
        prescription = "Vitamin D"
        notes        = "$ModeName smoke test"
    }

    $recordUpdate = Invoke-Json "$BaseUrl/records/$($record.id)" "Put" @{
        notes = "Updated $ModeName notes"
    }

    $appointment = Invoke-Json "$BaseUrl/appointments" "Post" @{
        patient_id        = $patient.id
        doctor_id         = 1
        appointment_date  = "2026-06-16T10:00:00.000Z"
        status            = "scheduled"
    }

    $appointmentUpdate = Invoke-Json "$BaseUrl/appointments/$($appointment.id)" "Put" @{
        status = "completed"
    }

    $tmpFile = Join-Path $env:TEMP "medivault-$($ModeName.ToLower())-$stamp.txt"
    Set-Content -LiteralPath $tmpFile -Value "$ModeName upload test"
    $upload = (curl.exe -s -X POST -F "patient_id=$($patient.id)" -F "report_name=$ModeName Smoke Report" -F "file=@$tmpFile" "$BaseUrl/reports") | ConvertFrom-Json

    $patients = Invoke-RestMethod -Uri "$BaseUrl/patients" -Method Get
    $records = Invoke-RestMethod -Uri "$BaseUrl/records" -Method Get
    $reports = Invoke-RestMethod -Uri "$BaseUrl/reports" -Method Get
    $appointments = Invoke-RestMethod -Uri "$BaseUrl/appointments" -Method Get

    $result = [ordered]@{
        register          = $register
        login             = $login
        patient           = $patient
        patientUpdate     = $patientUpdate
        record            = $record
        recordUpdate      = $recordUpdate
        appointment       = $appointment
        appointmentUpdate = $appointmentUpdate
        upload            = $upload
        counts            = @{
            patients     = $patients.Count
            records      = $records.Count
            reports      = $reports.Count
            appointments = $appointments.Count
        }
    }

    Write-Step "$ModeName mode smoke test complete"
    return $result
}

try {
    Stop-NodeBackends

    Write-Step "Starting PostgreSQL mode backend"
    Start-Backend -WorkingDirectory $BackendDir -StdOutLog (Join-Path $BackendDir "verify-postgres.stdout.log") -StdErrLog (Join-Path $BackendDir "verify-postgres.stderr.log") -EnvPairs @("DATA_MODE=postgres", "PORT=5000")
    $postgresHealth = Wait-ForHealth -BaseUrl $PostgresBaseUrl
    Write-Step ("PostgreSQL health: " + ($postgresHealth | ConvertTo-Json -Compress))

    $postgresResult = Test-Mode -BaseUrl $PostgresBaseUrl -ModeName "Postgres"

    Write-Step "Restarting PostgreSQL backend to verify persistence"
    Stop-NodeBackends
    Start-Backend -WorkingDirectory $BackendDir -StdOutLog (Join-Path $BackendDir "verify-postgres-restart.stdout.log") -StdErrLog (Join-Path $BackendDir "verify-postgres-restart.stderr.log") -EnvPairs @("DATA_MODE=postgres", "PORT=5000")
    Wait-ForHealth -BaseUrl $PostgresBaseUrl | Out-Null

    $relogin = Invoke-Json "$PostgresBaseUrl/auth/login" "Post" @{
        email    = $postgresResult.login.user.email
        password = "password123"
    }
    $reportsAfterRestart = Invoke-RestMethod -Uri "$PostgresBaseUrl/reports" -Method Get

    $persistenceCheck = [ordered]@{
        reloginTokenPresent = [bool]$relogin.token
        reportStillPresent  = [bool]($reportsAfterRestart | Where-Object { $_.report_name -eq "Postgres Smoke Report" })
    }

    Write-Step ("PostgreSQL persistence check: " + ($persistenceCheck | ConvertTo-Json -Compress))

    Write-Step "Cleaning up PostgreSQL smoke-test data"
    Invoke-RestMethod -Uri "$PostgresBaseUrl/appointments/$($postgresResult.appointment.id)" -Method Delete | Out-Null
    Invoke-RestMethod -Uri "$PostgresBaseUrl/records/$($postgresResult.record.id)" -Method Delete | Out-Null
    Invoke-RestMethod -Uri "$PostgresBaseUrl/reports/$($postgresResult.upload.id)" -Method Delete | Out-Null
    Invoke-RestMethod -Uri "$PostgresBaseUrl/patients/$($postgresResult.patient.id)" -Method Delete | Out-Null

    if (-not $SkipMemoryMode) {
        Write-Step "Starting memory mode backend"
        Start-Backend -WorkingDirectory $BackendDir -StdOutLog (Join-Path $BackendDir "verify-memory.stdout.log") -StdErrLog (Join-Path $BackendDir "verify-memory.stderr.log") -EnvPairs @("DATA_MODE=memory", "PORT=5001")
        Wait-ForHealth -BaseUrl $MemoryBaseUrl | Out-Null
        $memoryResult = Test-Mode -BaseUrl $MemoryBaseUrl -ModeName "Memory"
        Invoke-RestMethod -Uri "$MemoryBaseUrl/appointments/$($memoryResult.appointment.id)" -Method Delete | Out-Null
        Invoke-RestMethod -Uri "$MemoryBaseUrl/records/$($memoryResult.record.id)" -Method Delete | Out-Null
        Invoke-RestMethod -Uri "$MemoryBaseUrl/reports/$($memoryResult.upload.id)" -Method Delete | Out-Null
        Invoke-RestMethod -Uri "$MemoryBaseUrl/patients/$($memoryResult.patient.id)" -Method Delete | Out-Null
    } else {
        $memoryResult = $null
    }

    [ordered]@{
        postgresHealth   = $postgresHealth
        postgresResult   = $postgresResult
        persistenceCheck = $persistenceCheck
        memoryResult     = $memoryResult
    } | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "`n[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    throw
}
