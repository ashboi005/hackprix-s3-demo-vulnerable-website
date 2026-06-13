const demoData = require("./demoData");

function listAppointments(req, res) {
  return res.json(demoData.appointments);
}

function createAppointment(req, res) {
  const appointment = {
    id: demoData.appointments.length + 1,
    patient_id: req.body.patient_id,
    doctor_id: req.body.doctor_id,
    appointment_date: req.body.appointment_date,
    status: req.body.status || "scheduled",
  };

  demoData.appointments.push(appointment);
  return res.status(201).json(appointment);
}

module.exports = { listAppointments, createAppointment };
