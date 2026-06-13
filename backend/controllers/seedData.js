const patientUsers = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    name: `Patient ${id}`,
    email: `patient${id}@medivault.com`,
    password: "password123",
    role: "patient",
  };
});

const doctorUsers = Array.from({ length: 10 }, (_, index) => {
  const id = 100 + index + 1;
  return {
    id,
    name: `Doctor ${index + 1}`,
    email: `doctor${index + 1}@medivault.com`,
    password: "password123",
    role: "doctor",
  };
});

const adminUser = {
  id: 999,
  name: "Admin User",
  email: "admin@medivault.com",
  password: "password123",
  role: "admin",
};

const users = [...patientUsers, ...doctorUsers, adminUser];

const patients = patientUsers.map((user, index) => ({
  id: user.id,
  user_id: user.id,
  age: 25 + (index % 30),
  blood_group: ["A+", "B+", "O+", "AB-"][index % 4],
  phone: `555-01${String(index + 1).padStart(2, "0")}`,
  insurance_number: `INS-${1000 + index}`,
}));

const records = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  patient_id: patients[index % patients.length].id,
  doctor_id: doctorUsers[index % doctorUsers.length].id,
  diagnosis: ["Diabetes", "Hypertension", "Asthma", "Migraine", "Vitamin D Deficiency"][index % 5],
  prescription: `Medication ${index + 1}`,
  notes: `Clinical note ${index + 1}`,
  created_at: new Date(Date.UTC(2026, index % 12, (index % 28) + 1)).toISOString(),
}));

const reports = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  patient_id: patients[index % patients.length].id,
  report_name: `Report ${index + 1}`,
  file_path: `/uploads/report-${index + 1}.pdf`,
  uploaded_at: new Date(Date.UTC(2026, index % 12, (index % 28) + 1)).toISOString(),
}));

const appointments = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  patient_id: patients[index % patients.length].id,
  doctor_id: doctorUsers[index % doctorUsers.length].id,
  appointment_date: new Date(Date.UTC(2026, 5, (index % 28) + 1)).toISOString(),
  status: ["scheduled", "completed", "cancelled"][index % 3],
}));

module.exports = {
  users,
  patients,
  doctors: doctorUsers,
  records,
  reports,
  appointments,
};
