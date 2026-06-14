const {
  listPatients: loadPatients,
  getPatientById: loadPatientById,
  createPatient: storePatient,
  updatePatient: storePatientUpdate,
  deletePatient: removePatient,
} = require("../db/dataAccess");

async function listPatients(req, res) {
   
  return res.json(await loadPatients());
}

async function getPatientById(req, res) {
  const patient = await loadPatientById(req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  return res.json(patient);
}

async function createPatient(req, res) {
  return res.status(201).json(await storePatient(req.body));
}

async function updatePatient(req, res) {
  const patient = await storePatientUpdate(req.params.id, req.body);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  return res.json(patient);
}

async function deletePatient(req, res) {
  const deleted = await removePatient(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Patient not found" });
  return res.json({ deleted: true });
}

module.exports = { listPatients, getPatientById, createPatient, updatePatient, deletePatient };
