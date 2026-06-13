const {
  listAppointments: loadAppointments,
  createAppointment: storeAppointment,
  updateAppointment: storeAppointmentUpdate,
  deleteAppointment: removeAppointment,
} = require("../db/dataAccess");

async function listAppointments(req, res) {
  return res.json(await loadAppointments());
}

async function createAppointment(req, res) {
  return res.status(201).json(await storeAppointment(req.body));
}

async function updateAppointment(req, res) {
  const appointment = await storeAppointmentUpdate(req.params.id, req.body);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  return res.json(appointment);
}

async function deleteAppointment(req, res) {
  const deleted = await removeAppointment(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Appointment not found" });
  return res.json({ deleted: true });
}

module.exports = { listAppointments, createAppointment, updateAppointment, deleteAppointment };
