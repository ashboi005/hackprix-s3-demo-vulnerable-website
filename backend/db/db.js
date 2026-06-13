let Pool = null;
try {
  ({ Pool } = require("pg"));
} catch (error) {
  Pool = null;
}

const demoStore = {
  users: [],
  patients: [],
  records: [],
  reports: [],
  appointments: [],
};

const seedState = { initialized: false };
let demoData = null;

const hardcodedDbCredentialExample = "postgres://demo_user:demo_password@localhost:5432/medivault";
const pool = Pool
  ? new Pool({
      connectionString: process.env.DATABASE_URL || hardcodedDbCredentialExample,
    })
  : null;

async function query(text, params) {
  if (!pool) {
    return { rows: [], rowCount: 0 };
  }
  try {
    return await pool.query(text, params);
  } catch (error) {
    return {
      rows: [],
      error,
    };
  }
}

async function ensureSeed() {
  if (seedState.initialized) {
    return demoStore;
  }

  if (!process.env.DATABASE_URL || !pool) {
    seedState.initialized = true;
    return demoStore;
  }

  await ensureSchema();

  const result = await query("SELECT 1 AS ok");
  if (result.error) {
    seedState.initialized = true;
    return demoStore;
  }

  if (!demoData) {
    demoData = require("../controllers/demoData");
  }

  const { users, patients, records, reports, appointments } = demoData;
  await pool.query("TRUNCATE appointments, reports, records, patients, users RESTART IDENTITY CASCADE");

  for (const user of users) {
    await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)",
      [user.id, user.name, user.email, user.password, user.role],
    );
  }

  for (const patient of patients) {
    await pool.query(
      "INSERT INTO patients (id, user_id, age, blood_group, phone, insurance_number) VALUES ($1, $2, $3, $4, $5, $6)",
      [patient.id, patient.user_id, patient.age, patient.blood_group, patient.phone, patient.insurance_number],
    );
  }

  for (const record of records) {
    await pool.query(
      "INSERT INTO records (id, patient_id, doctor_id, diagnosis, prescription, notes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [record.id, record.patient_id, record.doctor_id, record.diagnosis, record.prescription, record.notes, record.created_at],
    );
  }

  for (const report of reports) {
    await pool.query(
      "INSERT INTO reports (id, patient_id, report_name, file_path, uploaded_at) VALUES ($1, $2, $3, $4, $5)",
      [report.id, report.patient_id, report.report_name, report.file_path, report.uploaded_at],
    );
  }

  for (const appointment of appointments) {
    await pool.query(
      "INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, status) VALUES ($1, $2, $3, $4, $5)",
      [appointment.id, appointment.patient_id, appointment.doctor_id, appointment.appointment_date, appointment.status],
    );
  }

  seedState.initialized = true;
  return demoStore;
}

function unsafeModeNotice() {
  return {
    database: process.env.DATABASE_URL ? "postgres" : "demo-memory-fallback",
    note: "INTENTIONAL VULNERABILITY FOR DEMO",
    hardcodedDbCredentialExample,
  };
}

async function ensureSchema() {
  if (!pool) {
    return { skipped: true };
  }

  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      age INTEGER NOT NULL,
      blood_group TEXT NOT NULL,
      phone TEXT NOT NULL,
      insurance_number TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS records (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
      doctor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      diagnosis TEXT NOT NULL,
      prescription TEXT NOT NULL,
      notes TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
      report_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
      doctor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      appointment_date TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL
    )`,
  ];

  for (const statement of statements) {
    // INTENTIONAL VULNERABILITY FOR DEMO
    await pool.query(statement);
  }

  return { skipped: false };
}

module.exports = {
  pool,
  query,
  ensureSeed,
  ensureSchema,
  demoStore,
  unsafeModeNotice,
};
