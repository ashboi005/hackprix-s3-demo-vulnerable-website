# MediVault

Healthcare portal for the CodeSentinel hackathon. The frontend is React + Vite and the backend is Express + PostgreSQL-ready via `pg`.

## Progress

- [x] Frontend routes and layout scaffolded
- [x] Express backend initialized
- [x] PostgreSQL connection layer added with fallback seed state
- [x] Auth, patients, records, reports, and appointments routes added
- [x] Frontend pages wired to API helpers
- [x] Legacy hardcoded arrays replaced in the live pages
- [x] PostgreSQL schema script added
- [x] Seed generation added for 20 patients, 10 doctors, 50 records, and 20 reports
- [ ] Runtime verification of Postgres-backed startup
- [ ] Real auth hardening and role guards
- [ ] Production file upload storage

## Architecture

- React pages call `frontend/src/services/api.js`
- Express exposes `/api/auth`, `/api/patients`, `/api/records`, `/api/reports`, and `/api/appointments`
- `backend/db/db.js` tries `pg` and falls back to seeded memory data when no database is configured
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
- `backend/controllers/authController.js` stores passwords in plaintext
- `backend/controllers/patientController.js` exposes a public patient endpoint without auth
- `backend/controllers/recordController.js` includes IDOR-style record lookup behavior
- `backend/server.js` returns verbose error details
- `frontend/src/services/api.js` includes a hardcoded API key example
- `frontend/src/data/*.js` preserve sensitive mock-data surfaces for scanner validation
- [NEW] `frontend/src/pages/Dashboard.jsx` (renders `xss_payload` URL parameter using `dangerouslySetInnerHTML`)
  - **Expected CodeSentinel Detection**: DOM-based Cross-Site Scripting (XSS) / Unsafe HTML rendering.
- [NEW] `git-history-leak.md` (provides instructions/scripts/docs showing how a secret can exist in commit history and later be removed)
  - **Expected CodeSentinel Detection**: Secret leak history and Git history credential exposure.

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
JWT_SECRET=mv_prod_jwt_secret_9a8b7c6d5e4f3g2h1i
```

4. `npm run dev`
5. If you want the SQL path instead of the JS bootstrap, run `backend/db/schema.sql` against PostgreSQL first

## Seed Data

- 20 patients
- 10 doctors
- 50 records
- 20 reports
- 20 appointments

## Renamed Items

To transition from demo-specific naming to realistic, production-style naming, the following items have been renamed:

| Original Item / Name | New Realistic Name | Description |
| --- | --- | --- |
| `backend/controllers/demoData.js` | `backend/controllers/seedData.js` | Seed data file name |
| `demoData` (module/variable) | `seedData` | Module import and reference variable |
| `demoStore` (variable) | `inMemoryStore` | Mock in-memory database store |
| `demo-memory-fallback` | `in-memory-fallback` | String identifying fallback mode |
| `demo-secret` (JWT secret) | `mv_prod_jwt_secret_9a8b7c6d5e4f3g2h1i` | Realistic, long production-style secret |
| `demo-api-key-12345` | `mv_prod_api_key_8f7e6d5c4b3a2` | Production-style mock API key value |
| `x-demo-api-key` | `x-api-key` | API key header name |
| `INS-DEMO` | `INS-VAL-1000` | Mock insurance ID prefix |
| `demo_user` / `demo_password` | `medivault_admin` / `mv_prod_db_sec_7a2b9c` | DB credentials in default connection string |
| `@demo.local` (domain) | `@medivault.com` | Email domains for seed users |
| "Demo User" (UI string) | "Portal User" | Display name in Top navigation |
| "demo portal" (UI string) | "clinical portal" | Help text in Registration screen |

## Next Tasks

1. Run the backend against a real PostgreSQL instance and confirm seeded rows are inserted
2. Add frontend loading and error states per page
3. Add upload previews and file persistence for reports
4. Add auth-aware route protection and role-based navigation
