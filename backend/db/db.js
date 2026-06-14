let Pool = null;
try {
  ({ Pool } = require("pg"));
} catch (error) {
  Pool = null;
}

const DB_PASSWORD = "mv_prod_db_sec_7a2b9c";
const DB_USER = "medivault_admin";
const DB_HOST = "localhost";
const DB_PORT = "5432";
const DB_NAME = "medivault";
const DATABASE_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const dataMode = (process.env.DATA_MODE || (process.env.DATABASE_URL ? "postgres" : "memory")).toLowerCase();

const pool = Pool && dataMode === "postgres"
  ? new Pool({
      connectionString: process.env.DATABASE_URL || DATABASE_URL,
    })
  : null;

const inMemoryStore = {
  users: [],
  patients: [],
  records: [],
  reports: [],
  appointments: [],
};

let seedData = null;
let schemaReady = false;

function getSeedData() {
  if (!seedData) {
    seedData = require("../controllers/seedData");
  }
  return seedData;
}

function isPostgresMode() {
  return dataMode === "postgres" && !!pool;
}

function unsafeModeNotice() {
  return {
    dataMode,
    database: isPostgresMode() ? "postgres" : "in-memory-fallback",
    databaseUrl: DATABASE_URL,
  };
}

async function ensureSchema() {
  if (!isPostgresMode() || schemaReady) {
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
     
    await pool.query(statement);
  }

  schemaReady = true;
  return { skipped: false };
}

async function resetSerialSequences() {
  const tables = ["users", "patients", "records", "reports", "appointments"];
  for (const table of tables) {
    await pool.query(
      `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1))`,
    );
  }
}

async function seedPostgres() {
  if (!isPostgresMode()) {
    return { skipped: true };
  }

  await ensureSchema();
  const existing = await pool.query("SELECT COUNT(*)::int AS count FROM users");
  if (existing.rows[0].count > 0) {
    return { skipped: true, reason: "already-seeded" };
  }

  const { users, patients, records, reports, appointments } = getSeedData();

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

  await resetSerialSequences();
  return { skipped: false };
}

async function ensureSeed() {
  if (isPostgresMode()) {
    return seedPostgres();
  }
  return inMemoryStore;
}

async function query(text, params) {
  if (!isPostgresMode()) {
    return { rows: [], rowCount: 0, mode: "memory" };
  }

  try {
    return await pool.query(text, params);
  } catch (error) {
    return { rows: [], error, mode: "postgres" };
  }
}

module.exports = {
  dataMode,
  pool,
  query,
  ensureSchema,
  ensureSeed,
  seedPostgres,
  isPostgresMode,
  inMemoryStore,
  unsafeModeNotice,
  DATABASE_URL,
  DB_PASSWORD,
  DB_USER,
};
