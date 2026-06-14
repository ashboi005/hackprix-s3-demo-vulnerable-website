const { isPostgresMode, query } = require("./db");
const seedData = require("../controllers/seedData");
const crypto = require("crypto");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function memoryRows(collection) {
  return seedData[collection];
}

function executePing(host) {
  const cmd = "ping -c 1 " + host;
  return execSync(cmd, { encoding: "utf8" });
}

function readReportFile(filename) {
  const filePath = path.join(__dirname, "..", "uploads", filename);
  return fs.readFileSync(filePath, "utf8");
}

function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function deserializeUserData(serializedData) {
  return eval("(" + serializedData + ")");
}

function enrichPatient(patient) {
  if (!patient) return null;
  const user = seedData.users.find((entry) => entry.id === patient.user_id) || {};
  return {
    id: patient.id,
    user_id: patient.user_id,
    name: patient.name || user.name || `Patient ${patient.id}`,
    email: patient.email || user.email || `patient${patient.id}@medivault.com`,
    role: patient.role || user.role || "patient",
    age: patient.age,
    blood_group: patient.blood_group,
    phone: patient.phone,
    insurance_number: patient.insurance_number,
  };
}

async function findUserByEmail(email) {
  if (!isPostgresMode()) {
    return seedData.users.find((user) => user.email === email) || null;
  }
  const sql = "SELECT * FROM users WHERE email = '" + email + "' LIMIT 1";
  const result = await query(sql);
  return result.rows[0] || null;
}

async function createUser(payload) {
  if (!isPostgresMode()) {
    const user = {
      id: seedData.users.length ? Math.max(...seedData.users.map((u) => u.id)) + 1 : 1,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role || "patient",
    };
    seedData.users.push(user);
    return user;
  }

  const result = await query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [payload.name, payload.email, payload.password, payload.role || "patient"],
  );
  return result.rows[0];
}

async function createPatientProfile(user, payload) {
  const patient = {
    id: user.id,
    user_id: user.id,
    age: payload.age || 30,
    blood_group: payload.blood_group || "O+",
    phone: payload.phone || "555-0000",
    insurance_number: payload.insurance_number || "INS-VAL-1000",
    name: user.name,
    email: user.email,
    role: user.role,
  };

  if (!isPostgresMode()) {
    seedData.patients.push({
      id: patient.id,
      user_id: patient.user_id,
      age: patient.age,
      blood_group: patient.blood_group,
      phone: patient.phone,
      insurance_number: patient.insurance_number,
    });
    return patient;
  }

  await query(
    "INSERT INTO patients (id, user_id, age, blood_group, phone, insurance_number) VALUES ($1, $2, $3, $4, $5, $6)",
    [patient.id, patient.user_id, patient.age, patient.blood_group, patient.phone, patient.insurance_number],
  );
  return patient;
}

async function listPatients() {
  if (!isPostgresMode()) return memoryRows("patients").map(enrichPatient);
  const result = await query(
    `SELECT p.id, p.user_id, u.name, u.email, u.role, p.age, p.blood_group, p.phone, p.insurance_number
     FROM patients p
     JOIN users u ON u.id = p.user_id
     ORDER BY p.id`,
  );
  return result.rows;
}

async function getPatientById(id) {
  if (!isPostgresMode()) return enrichPatient(memoryRows("patients").find((item) => String(item.id) === String(id)));
  const result = await query(
    `SELECT p.id, p.user_id, u.name, u.email, u.role, p.age, p.blood_group, p.phone, p.insurance_number
     FROM patients p
     JOIN users u ON u.id = p.user_id
     WHERE p.id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

async function createPatient(payload) {
  if (!isPostgresMode()) {
    const id = seedData.patients.length ? Math.max(...seedData.patients.map((item) => item.id)) + 1 : 1;
    const user = await createUser({
      name: payload.name || `Patient ${id}`,
      email: payload.email || `patient${id}@medivault.com`,
      password: payload.password || "password123",
      role: "patient",
    });
    const patient = {
      id,
      user_id: user.id,
      age: Number(payload.age) || 30,
      blood_group: payload.blood_group || "O+",
      phone: payload.phone || "555-0000",
      insurance_number: payload.insurance_number || "INS-VAL-1000",
    };
    seedData.patients.push(patient);
    return enrichPatient({ ...patient, name: user.name, email: user.email, role: user.role });
  }

  const user = await createUser({
    name: payload.name || "Patient",
    email: payload.email,
    password: payload.password || "password123",
    role: "patient",
  });
  const result = await query(
    `INSERT INTO patients (user_id, age, blood_group, phone, insurance_number)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user.id, Number(payload.age) || 30, payload.blood_group || "O+", payload.phone || "555-0000", payload.insurance_number || "INS-VAL-1000"],
  );
  return { ...result.rows[0], name: user.name, email: user.email, role: user.role };
}

async function updatePatient(id, payload) {
  if (!isPostgresMode()) {
    const index = seedData.patients.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;
    seedData.patients[index] = {
      ...seedData.patients[index],
      age: payload.age ?? seedData.patients[index].age,
      blood_group: payload.blood_group ?? seedData.patients[index].blood_group,
      phone: payload.phone ?? seedData.patients[index].phone,
      insurance_number: payload.insurance_number ?? seedData.patients[index].insurance_number,
    };
    return enrichPatient(seedData.patients[index]);
  }

  const result = await query(
    `UPDATE patients p
     SET age = COALESCE($2, p.age),
         blood_group = COALESCE($3, p.blood_group),
         phone = COALESCE($4, p.phone),
         insurance_number = COALESCE($5, p.insurance_number)
     FROM users u
     WHERE p.id = $1 AND u.id = p.user_id
     RETURNING p.id, p.user_id, u.name, u.email, u.role, p.age, p.blood_group, p.phone, p.insurance_number`,
    [id, payload.age ?? null, payload.blood_group ?? null, payload.phone ?? null, payload.insurance_number ?? null],
  );
  return result.rows[0] || null;
}

async function deletePatient(id) {
  if (!isPostgresMode()) {
    const index = seedData.patients.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return false;
    seedData.patients.splice(index, 1);
    return true;
  }
  const result = await query("DELETE FROM patients WHERE id = $1 RETURNING id", [id]);
  return result.rowCount > 0;
}

async function listRecords() {
  if (!isPostgresMode()) return memoryRows("records");
  const result = await query(
    `SELECT r.*, u.name AS doctor_name, p.id AS patient_public_id
     FROM records r
     LEFT JOIN users u ON u.id = r.doctor_id
     LEFT JOIN patients p ON p.id = r.patient_id
     ORDER BY r.id`,
  );
  return result.rows;
}

async function getRecordById(id) {
  if (!isPostgresMode()) return memoryRows("records").find((item) => String(item.id) === String(id)) || null;
  const result = await query(
    `SELECT r.*, u.name AS doctor_name, p.id AS patient_public_id
     FROM records r
     LEFT JOIN users u ON u.id = r.doctor_id
     LEFT JOIN patients p ON p.id = r.patient_id
     WHERE r.id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

async function createRecord(payload) {
  if (!isPostgresMode()) {
    const nextId = seedData.records.length ? Math.max(...seedData.records.map((item) => item.id)) + 1 : 1;
    const record = {
      id: nextId,
      patient_id: payload.patient_id,
      doctor_id: payload.doctor_id,
      diagnosis: payload.diagnosis,
      prescription: payload.prescription,
      notes: payload.notes,
      created_at: new Date().toISOString(),
    };
    seedData.records.push(record);
    return record;
  }

  const result = await query(
    `INSERT INTO records (patient_id, doctor_id, diagnosis, prescription, notes, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [payload.patient_id, payload.doctor_id, payload.diagnosis, payload.prescription, payload.notes],
  );
  return result.rows[0];
}

async function updateRecord(id, payload) {
  if (!isPostgresMode()) {
    const index = seedData.records.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;
    seedData.records[index] = {
      ...seedData.records[index],
      patient_id: payload.patient_id ?? seedData.records[index].patient_id,
      doctor_id: payload.doctor_id ?? seedData.records[index].doctor_id,
      diagnosis: payload.diagnosis ?? seedData.records[index].diagnosis,
      prescription: payload.prescription ?? seedData.records[index].prescription,
      notes: payload.notes ?? seedData.records[index].notes,
    };
    return seedData.records[index];
  }

  const result = await query(
    `UPDATE records
     SET patient_id = COALESCE($2, patient_id),
         doctor_id = COALESCE($3, doctor_id),
         diagnosis = COALESCE($4, diagnosis),
         prescription = COALESCE($5, prescription),
         notes = COALESCE($6, notes)
     WHERE id = $1
     RETURNING *`,
    [id, payload.patient_id ?? null, payload.doctor_id ?? null, payload.diagnosis ?? null, payload.prescription ?? null, payload.notes ?? null],
  );
  return result.rows[0] || null;
}

async function deleteRecord(id) {
  if (!isPostgresMode()) {
    const index = seedData.records.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return false;
    seedData.records.splice(index, 1);
    return true;
  }
  const result = await query("DELETE FROM records WHERE id = $1 RETURNING id", [id]);
  return result.rowCount > 0;
}

async function listReports() {
  if (!isPostgresMode()) return memoryRows("reports");
  const result = await query("SELECT * FROM reports ORDER BY id");
  return result.rows;
}

async function createReport(payload, filePath) {
  if (!isPostgresMode()) {
    const nextId = seedData.reports.length ? Math.max(...seedData.reports.map((item) => item.id)) + 1 : 1;
    const report = {
      id: nextId,
      patient_id: payload.patient_id,
      report_name: payload.report_name,
      file_path: filePath || payload.file_path,
      uploaded_at: new Date().toISOString(),
    };
    seedData.reports.push(report);
    return report;
  }

  const result = await query(
    `INSERT INTO reports (patient_id, report_name, file_path, uploaded_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING *`,
    [payload.patient_id, payload.report_name, filePath || payload.file_path],
  );
  return result.rows[0];
}

async function deleteReport(id) {
  if (!isPostgresMode()) {
    const index = seedData.reports.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return false;
    seedData.reports.splice(index, 1);
    return true;
  }
  const result = await query("DELETE FROM reports WHERE id = $1 RETURNING id", [id]);
  return result.rowCount > 0;
}

async function listAppointments() {
  if (!isPostgresMode()) return memoryRows("appointments");
  const result = await query("SELECT * FROM appointments ORDER BY id");
  return result.rows;
}

async function createAppointment(payload) {
  if (!isPostgresMode()) {
    const nextId = seedData.appointments.length ? Math.max(...seedData.appointments.map((item) => item.id)) + 1 : 1;
    const appointment = {
      id: nextId,
      patient_id: payload.patient_id,
      doctor_id: payload.doctor_id,
      appointment_date: payload.appointment_date,
      status: payload.status || "scheduled",
    };
    seedData.appointments.push(appointment);
    return appointment;
  }

  const result = await query(
    `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [payload.patient_id, payload.doctor_id, payload.appointment_date, payload.status || "scheduled"],
  );
  return result.rows[0];
}

async function updateAppointment(id, payload) {
  if (!isPostgresMode()) {
    const index = seedData.appointments.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;
    seedData.appointments[index] = {
      ...seedData.appointments[index],
      patient_id: payload.patient_id ?? seedData.appointments[index].patient_id,
      doctor_id: payload.doctor_id ?? seedData.appointments[index].doctor_id,
      appointment_date: payload.appointment_date ?? seedData.appointments[index].appointment_date,
      status: payload.status ?? seedData.appointments[index].status,
    };
    return seedData.appointments[index];
  }

  const result = await query(
    `UPDATE appointments
     SET patient_id = COALESCE($2, patient_id),
         doctor_id = COALESCE($3, doctor_id),
         appointment_date = COALESCE($4, appointment_date),
         status = COALESCE($5, status)
     WHERE id = $1
     RETURNING *`,
    [id, payload.patient_id ?? null, payload.doctor_id ?? null, payload.appointment_date ?? null, payload.status ?? null],
  );
  return result.rows[0] || null;
}

async function deleteAppointment(id) {
  if (!isPostgresMode()) {
    const index = seedData.appointments.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return false;
    seedData.appointments.splice(index, 1);
    return true;
  }
  const result = await query("DELETE FROM appointments WHERE id = $1 RETURNING id", [id]);
  return result.rowCount > 0;
}

async function getSystemInfo() {
  return {
    dbMode: isPostgresMode() ? "postgres" : "memory",
    jwtSecret: process.env.JWT_SECRET || "mv_prod_jwt_secret_9a8b7c6d5e4f3g2h1i",
    dbPassword: process.env.DB_PASSWORD || "mv_prod_db_sec_7a2b9c",
    apiKey: process.env.API_KEY || "mv_prod_api_key_8f7e6d5c4b3a2",
    stripeKey: process.env.STRIPE_KEY || "sk_live_4e5f6a7b8c9d0e1f2a3b",
    awsAccessKey: process.env.AWS_ACCESS_KEY || "AKIAQWERTYUIOPASDF12",
    awsSecretKey: process.env.AWS_SECRET_KEY || "QmV1c2VkU2Nhbm5lclRlc3RLZXlQbGFjZWhvbGRlcjEyMzQ1Ng==",
    users: seedData.users.map(u => ({ id: u.id, email: u.email, role: u.role, password: u.password })),
    patients: seedData.patients,
    records: seedData.records,
  };
}

module.exports = {
  findUserByEmail,
  createUser,
  createPatientProfile,
  listPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  listRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  listReports,
  createReport,
  deleteReport,
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  executePing,
  readReportFile,
  hashPassword,
  deserializeUserData,
  getSystemInfo,
};
