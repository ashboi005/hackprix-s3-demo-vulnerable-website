# verify-persistence.ps1
# Script to verify data persistence across backend restarts in PostgreSQL mode.

$BaseUrl = "http://localhost:5000/api"
$Headers = @{ "Content-Type" = "application/json" }

function Log($msg) {
    Write-Host "[PERSISTENCE] $msg" -ForegroundColor Cyan
}

try {
    # 1. Create unique test data
    $rand = Get-Random
    $email = "persist_test_$rand@example.com"
    Log "Creating persistent user: $email"
    
    $regPayload = @{
        name = "Persistent Test User"
        email = $email
        password = "Password123!"
        role = "patient"
        age = 29
        blood_group = "O+"
        phone = "555-7777"
        insurance_number = "INS-PERSIST-$rand"
    } | ConvertTo-Json
    
    $regRes = Invoke-RestMethod -Uri "$BaseUrl/auth/register" -Method Post -Body $regPayload -Headers $Headers
    $userId = $regRes.user.id
    Log "Created User ID: $userId"

    # Wait, the patient profile is created automatically for patient role. Let's find its patient ID.
    $patients = Invoke-RestMethod -Uri "$BaseUrl/patients" -Method Get
    $patient = $patients | Where-Object { $_.email -eq $email }
    $patientId = $patient.id
    Log "Found Patient Profile ID: $patientId"

    # Create a record for this patient
    $recordPayload = @{
        patient_id = $patientId
        doctor_id = 1
        diagnosis = "Persistence Verification"
        prescription = "Rest & Hydration"
        notes = "This record must survive a backend restart."
    } | ConvertTo-Json
    $newRec = Invoke-RestMethod -Uri "$BaseUrl/records" -Method Post -Body $recordPayload -Headers $Headers
    $recordId = $newRec.id
    Log "Created Record ID: $recordId"

    # 2. Restart Backend
    Log "Stopping backend server process..."
    $backendProc = Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
    Stop-Process -Id $backendProc.Id -Force
    Start-Sleep -Seconds 2

    Log "Starting backend server again..."
    $task = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "d:\CodeSentinal_Demo\medivault\backend" -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 4

    # 3. Verify data still exists
    Log "Checking database for the persistent user and record..."
    $checkUser = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body (@{ email = $email; password = "Password123!" } | ConvertTo-Json) -Headers $Headers
    if ($checkUser.user.id -eq $userId) {
        Log "Success: User still exists with ID $userId!"
    } else {
        throw "Failed: User ID mismatch or not found!"
    }

    $checkRec = Invoke-RestMethod -Uri "$BaseUrl/records/$recordId" -Method Get
    if ($checkRec.diagnosis -eq "Persistence Verification") {
        Log "Success: Record still exists with ID $recordId and diagnosis '$($checkRec.diagnosis)'!"
    } else {
        throw "Failed: Record not found or diagnosis mismatch!"
    }

    # Clean up test data
    Log "Cleaning up persistent verification data..."
    $delRec = Invoke-RestMethod -Uri "$BaseUrl/records/$recordId" -Method Delete
    $delPat = Invoke-RestMethod -Uri "$BaseUrl/patients/$patientId" -Method Delete
    
    # We don't have delete user route, let's delete via psql directly
    $sql = "DELETE FROM users WHERE id = $userId;"
    $env:PGPASSWORD="mv_prod_db_sec_7a2b9c"
    & "D:\PostgreSQL\18\bin\psql.exe" -U medivault_admin -h 127.0.0.1 -d medivault -c $sql | Out-Null
    Log "Deleted verification user from database."

    Write-Host "`n[PERSISTENCE] SUCCESS! DATA PERSISTED CORRECTLY ACROSS RESTARTS!" -ForegroundColor Green

} catch {
    Write-Host "`n[ERROR] Persistence verification failed: $_" -ForegroundColor Red
    exit 1
}
