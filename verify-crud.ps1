# verify-crud.ps1
# Script to verify MediVault backend CRUD APIs in PostgreSQL mode.

$BaseUrl = "http://localhost:5000/api"
$Headers = @{ "Content-Type" = "application/json" }

function Log($msg) {
    Write-Host "[VERIFY] $msg" -ForegroundColor Cyan
}

try {
    # 1. Auth: Register
    Log "Testing Auth: Register..."
    $regPayload = @{
        name = "Postgres Test User"
        email = "pg_test_$(Get-Random)@example.com"
        password = "Password123!"
        role = "patient"
        age = 35
        blood_group = "AB-"
        phone = "555-9999"
        insurance_number = "INS-PG-9999"
    } | ConvertTo-Json
    $regRes = Invoke-RestMethod -Uri "$BaseUrl/auth/register" -Method Post -Body $regPayload -Headers $Headers
    Log "Registered User ID: $($regRes.user.id)"

    # 2. Auth: Login
    Log "Testing Auth: Login..."
    $loginPayload = @{
        email = $regRes.user.email
        password = "Password123!"
    } | ConvertTo-Json
    $loginRes = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginPayload -Headers $Headers
    if ($loginRes.token) {
        Log "Login Succeeded. Token received."
    } else {
        throw "Login failed: No token returned."
    }

    # 3. Patients: List Patients
    Log "Testing Patients: List..."
    $patients = Invoke-RestMethod -Uri "$BaseUrl/patients" -Method Get
    Log "Total Patients count: $($patients.Length)"

    # 4. Patients: Create Patient (we will create a doctor or another patient)
    Log "Testing Patients: Create..."
    $patientPayload = @{
        name = "New Postgres Patient"
        email = "pg_pat_$(Get-Random)@example.com"
        password = "Password123!"
        age = 42
        blood_group = "A+"
        phone = "555-8888"
        insurance_number = "INS-PG-8888"
    } | ConvertTo-Json
    $newPat = Invoke-RestMethod -Uri "$BaseUrl/patients" -Method Post -Body $patientPayload -Headers $Headers
    $newPatId = $newPat.id
    Log "Created Patient ID: $newPatId"

    # 5. Patients: Get Patient by ID
    Log "Testing Patients: Get ID..."
    $patGot = Invoke-RestMethod -Uri "$BaseUrl/patients/$newPatId" -Method Get
    Log "Fetched Patient Name: $($patGot.name)"

    # 6. Patients: Update Patient
    Log "Testing Patients: Update..."
    $updatePatPayload = @{
        age = 43
        blood_group = "O-"
    } | ConvertTo-Json
    $updatedPat = Invoke-RestMethod -Uri "$BaseUrl/patients/$newPatId" -Method Put -Body $updatePatPayload -Headers $Headers
    Log "Updated Patient Age: $($updatedPat.age), Blood Group: $($updatedPat.blood_group)"

    # 7. Records: Create Record
    Log "Testing Records: Create..."
    $recordPayload = @{
        patient_id = $newPatId
        doctor_id = 1 # Seed user 1 is admin/doctor
        diagnosis = "Mild seasonal allergies"
        prescription = "Cetirizine 10mg daily"
        notes = "Patient reports mild sneezing and itchy eyes."
    } | ConvertTo-Json
    $newRec = Invoke-RestMethod -Uri "$BaseUrl/records" -Method Post -Body $recordPayload -Headers $Headers
    $newRecId = $newRec.id
    Log "Created Record ID: $newRecId"

    # 8. Records: List Records
    Log "Testing Records: List..."
    $records = Invoke-RestMethod -Uri "$BaseUrl/records" -Method Get
    Log "Total Records count: $($records.Length)"

    # 9. Records: Update Record
    Log "Testing Records: Update..."
    $updateRecPayload = @{
        diagnosis = "Allergic Rhinitis"
        prescription = "Cetirizine 10mg daily + Fluticasone nasal spray"
        notes = "Symptoms persist. Added nasal spray."
    } | ConvertTo-Json
    $updatedRec = Invoke-RestMethod -Uri "$BaseUrl/records/$newRecId" -Method Put -Body $updateRecPayload -Headers $Headers
    Log "Updated Record Diagnosis: $($updatedRec.diagnosis)"

    # 10. Reports: Create Report
    Log "Testing Reports: Create..."
    $reportPayload = @{
        patient_id = $newPatId
        report_name = "Blood Test Results"
        file_path = "uploads/blood_test.pdf"
    } | ConvertTo-Json
    $newRep = Invoke-RestMethod -Uri "$BaseUrl/reports" -Method Post -Body $reportPayload -Headers $Headers
    $newRepId = $newRep.id
    Log "Created Report ID: $newRepId"

    # 11. Reports: List Reports
    Log "Testing Reports: List..."
    $reports = Invoke-RestMethod -Uri "$BaseUrl/reports" -Method Get
    Log "Total Reports count: $($reports.Length)"

    # 12. Appointments: Create Appointment
    Log "Testing Appointments: Create..."
    $appPayload = @{
        patient_id = $newPatId
        doctor_id = 1
        appointment_date = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        status = "scheduled"
    } | ConvertTo-Json
    $newApp = Invoke-RestMethod -Uri "$BaseUrl/appointments" -Method Post -Body $appPayload -Headers $Headers
    $newAppId = $newApp.id
    Log "Created Appointment ID: $newAppId"

    # 13. Appointments: Update Appointment
    Log "Testing Appointments: Update..."
    $updateAppPayload = @{
        status = "completed"
    } | ConvertTo-Json
    $updatedApp = Invoke-RestMethod -Uri "$BaseUrl/appointments/$newAppId" -Method Put -Body $updateAppPayload -Headers $Headers
    Log "Updated Appointment Status: $($updatedApp.status)"

    # 14. Appointments: List Appointments
    Log "Testing Appointments: List..."
    $appointments = Invoke-RestMethod -Uri "$BaseUrl/appointments" -Method Get
    Log "Total Appointments count: $($appointments.Length)"

    # Cleanup verification (delete tests)
    Log "Testing Delete operations (Cleanup)..."
    
    # Delete Appointment
    $delApp = Invoke-RestMethod -Uri "$BaseUrl/appointments/$newAppId" -Method Delete
    Log "Appointment Deleted: $($delApp.deleted)"

    # Delete Report
    $delRep = Invoke-RestMethod -Uri "$BaseUrl/reports/$newRepId" -Method Delete
    Log "Report Deleted: $($delRep.deleted)"

    # Delete Record
    $delRec = Invoke-RestMethod -Uri "$BaseUrl/records/$newRecId" -Method Delete
    Log "Record Deleted: $($delRec.deleted)"

    # Delete Patient
    $delPat = Invoke-RestMethod -Uri "$BaseUrl/patients/$newPatId" -Method Delete
    Log "Patient Deleted: $delPat"

    Write-Host "`n[VERIFY] ALL API CRUD TESTS PASSED SUCCESSFULLY AGAINST POSTGRESQL!" -ForegroundColor Green

} catch {
    Write-Host "`n[ERROR] Test failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Response Body: $body" -ForegroundColor Red
    }
    exit 1
}
