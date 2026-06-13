# MediVault

Healthcare portal demo for the CodeSentinel hackathon. The frontend is React + Vite and the backend is Express + PostgreSQL-ready via `pg`.

## Progress

- [x] Frontend routes and layout scaffolded
- [x] Express backend initialized
- [x] PostgreSQL connection layer added with demo fallback
- [x] Auth, patients, records, reports, and appointments routes added
- [x] Frontend pages wired to API helpers
- [x] Legacy hardcoded arrays replaced in the live pages
- [x] PostgreSQL schema script added
- [x] Demo seed generation added for 20 patients, 10 doctors, 50 records, and 20 reports
- [ ] Runtime verification of Postgres-backed startup
- [ ] Real auth hardening and role guards
- [ ] Production file upload storage

## Architecture

- React pages call `frontend/src/services/api.js`
- Express exposes `/api/auth`, `/api/patients`, `/api/records`, `/api/reports`, and `/api/appointments`
- `backend/db/db.js` tries `pg` and falls back to seeded demo memory data when no database is configured
- `backend/db/schema.sql` contains the table DDL
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

- `backend/db/db.js` includes a hardcoded database credential example
- `frontend/src/services/api.js` uses a hardcoded local API URL fallback
- `backend/controllers/authController.js` stores passwords in plaintext for demo purposes
- `backend/controllers/patientController.js` exposes a public patient endpoint without auth
- `backend/controllers/recordController.js` includes IDOR-style record lookup behavior
- `backend/server.js` returns verbose error details
- `frontend/src/services/api.js` includes a hardcoded API key example for demo scanning
- `frontend/src/data/*.js` preserve sensitive mock-data surfaces for scanner demos

## Setup Steps

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend

1. `cd backend`
2. `npm install`
3. Create `.env` if you want a real Postgres connection:

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/medivault
JWT_SECRET=demo-secret
```

4. `npm run dev`
5. If you want the SQL path instead of the JS bootstrap, run `backend/db/schema.sql` against PostgreSQL first

## Demo Data

- 20 patients
- 10 doctors
- 50 records
- 20 reports
- 20 appointments

## Next Tasks

1. Run the backend against a real PostgreSQL instance and confirm seeded rows are inserted
2. Add frontend loading and error states per page
3. Add upload previews and file persistence for reports
4. Add auth-aware route protection and role-based navigation
