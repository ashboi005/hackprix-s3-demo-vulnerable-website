const seedData = require("./seedData");

function listAppointments(req, res) {
  return res.json(seedData.appointments);
}

function createAppointment(req, res) {
  const appointment = {
    id: seedData.appointments.length + 1,
    patient_id: req.body.patient_id,
    doctor_id: req.body.doctor_id,
    appointment_date: req.body.appointment_date,
    status: req.body.status || "scheduled",
  };

  seedData.appointments.push(appointment);
  return res.status(201).json(appointment);
}

module.exports = { listAppointments, createAppointment };
