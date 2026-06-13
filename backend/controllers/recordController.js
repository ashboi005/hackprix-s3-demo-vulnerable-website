const seedData = require("./seedData");

function listRecords(req, res) {
  // INTENTIONAL VULNERABILITY FOR DEMO
  return res.json(seedData.records);
}

function getRecordById(req, res) {
  const record = seedData.records.find((entry) => String(entry.id) === req.params.id);
  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }
  // INTENTIONAL VULNERABILITY FOR DEMO
  return res.json(record);
}

function createRecord(req, res) {
  const nextId = seedData.records.length + 1;
  const record = {
    id: nextId,
    patient_id: req.body.patient_id,
    doctor_id: req.body.doctor_id,
    diagnosis: req.body.diagnosis,
    prescription: req.body.prescription,
    notes: req.body.notes,
    created_at: new Date().toISOString(),
  };

  seedData.records.push(record);
  return res.status(201).json(record);
}

module.exports = { listRecords, getRecordById, createRecord };
