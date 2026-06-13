const seedData = require("./seedData");

function listPatients(req, res) {
  // INTENTIONAL VULNERABILITY FOR DEMO
  return res.json(seedData.patients);
}

function getPatientById(req, res) {
  const patient = seedData.patients.find((entry) => String(entry.id) === req.params.id);
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }
  return res.json(patient);
}

module.exports = { listPatients, getPatientById };
