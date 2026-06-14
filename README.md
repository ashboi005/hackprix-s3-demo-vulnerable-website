# MediVault

Healthcare portal for the CodeSentinel hackathon. The frontend is React + Vite and the backend is Express with dual data modes:

- `DATA_MODE=memory`
- `DATA_MODE=postgres`

PostgreSQL is the primary demo mode when a database is configured, and memory mode remains available.

## Progress

- [x] Frontend routes and layout scaffolded
- [x] Express backend initialized
- [x] Memory data audited
- [x] PostgreSQL schema designed
- [x] `schema.sql` added
- [x] Seed data created for 20 patients, 10 doctors, 50 records, and 20 reports
- [x] Database connection layer added
- [x] Users, patients, records, reports, and appointments migrated to mode-aware controllers
- [x] Frontend pages connected to APIs
- [x] CRUD pages added for Patients, Records, Reports, and Appointments
- [x] Report uploads wired end to end
- [x] Intentional vulnerabilities preserved and commented
- [x] Memory mode verified through backend API checks
- [x] Full CRUD verified in memory mode (API smoke tests)
- [x] Frontend production build verified
- [x] Browser flow verified in memory mode (register, dashboard, patients, records, reports, appointments)
- [x] PostgreSQL mode verified against a live database

## Architecture

- React pages call `frontend/src/services/api.js`
- Express exposes `/api/auth`, `/api/patients`, `/api/records`, `/api/reports`, and `/api/appointments`
- `backend/db/db.js` selects memory or PostgreSQL mode using `DATA_MODE`
- `backend/db/dataAccess.js` provides mode-aware reads and writes
- `backend/controllers/seedData.js` holds deterministic seed data for both modes
- The app is intentionally insecure for security-scanner demonstrations

## Folder Structure

### Frontend

- `frontend/src/components`
- `frontend/src/layouts`
- `frontend/src/pages`
- `frontend/src/services/api.js`
- `frontend/src/data`

### Backend

- `backend/controllers`
- `backend/routes`
- `backend/middleware`
- `backend/db/db.js`
- `backend/db/dataAccess.js`
- `backend/db/schema.sql`
- `backend/server.js`

## Packages

### Frontend

- `react`
- `react-dom`
- `react-router-dom`
- `axios`

### Backend

- `express`
- `cors`
- `dotenv`
- `pg`
- `multer`
- `bcrypt`
- `jsonwebtoken`
- `nodemon`

## DB Schema

### `users`

- `id`
- `name`
- `email`
- `password`
- `role`

### `patients`

- `id`
- `user_id`
- `age`
- `blood_group`
- `phone`
- `insurance_number`

### `records`

- `id`
- `patient_id`
- `doctor_id`
- `diagnosis`
- `prescription`
- `notes`
- `created_at`

### `reports`

- `id`
- `patient_id`
- `report_name`
- `file_path`
- `uploaded_at`

### `appointments`

- `id`
- `patient_id`
- `doctor_id`
- `appointment_date`
- `status`

## APIs

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Patients

- `GET /api/patients`
- `GET /api/patients/:id`

### Records

- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/records`

### Reports

- `GET /api/reports`
- `POST /api/reports`

### Appointments

- `GET /api/appointments`
- `POST /api/appointments`

## Vulnerabilities

The following intentional vulnerabilities must remain in place:

- hardcoded API key in [`frontend/src/services/api.js`](/D:\CodeSentinal_Demo\medivault\frontend\src\services\api.js)
- hardcoded DB credential example in [`backend/db/db.js`](/D:\CodeSentinal_Demo\medivault\backend\db\db.js)
- plaintext password storage in the auth flow
- public patient endpoint without auth
- IDOR-style record lookup
- verbose error leakage from the backend error handler
- sensitive frontend data in [`frontend/src/data`](/D:\CodeSentinal_Demo\medivault\frontend\src\data)
- DOM XSS sink in [`frontend/src/pages/Dashboard.jsx`](/D:\CodeSentinal_Demo\medivault\frontend\src\pages\Dashboard.jsx)
- weak JWT fallback in auth middleware
- git-history leak demo file retained in the repo

## Setup Steps

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend

1. `cd backend`
2. `npm install`
3. Set environment variables:

```env
DATA_MODE=postgres
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/medivault
JWT_SECRET=mv_prod_jwt_secret_9a8b7c6d5e4f3g2h1i
```

4. Ensure PostgreSQL is running and bootstrap the database once (as a superuser):

```sql
CREATE USER medivault_admin WITH PASSWORD 'mv_prod_db_sec_7a2b9c';
CREATE DATABASE medivault OWNER medivault_admin;
```

5. Run `backend/db/schema.sql` against the `medivault` database (tables are also auto-created on first backend start)
6. `npm run dev` (or `npm start` for production)

Memory mode uses `DATA_MODE=memory` and does not require a database.

### Verification status (2026-06-14)

| Check | Memory mode | PostgreSQL mode |
| --- | --- | --- |
| Register / login | Verified | Verified |
| Patients CRUD | Verified | Verified |
| Records CRUD | Verified | Verified |
| Reports upload/delete | Verified | Verified |
| Appointments CRUD | Verified | Verified |
| Restart persistence | N/A (in-memory) | Verified |
| Frontend build | `npm run build` passed | `npm run build` passed |
| Browser E2E flow | Verified | Verified |

Verification notes:

- PostgreSQL mode was started from `backend/.env` with `DATA_MODE=postgres` and `PORT=5000`.
- Memory mode was started separately with `DATA_MODE=memory` and `PORT=5001`.
- PostgreSQL restart persistence was verified by registering a user, uploading a report, restarting the backend, and confirming the same login and report still existed.

## Seed Data

- 20 patients
- 10 doctors
- 50 records
- 20 reports
- 20 appointments

## Next Tasks

1. Add route guards and role-aware navigation if needed for the demo
2. Decide whether to keep the temporary verification log files in `backend/`

