const demoData = require("./demoData");

function listRecords(req, res) {
  // INTENTIONAL VULNERABILITY FOR DEMO
  return res.json(demoData.records);
}

function getRecordById(req, res) {
  const record = demoData.records.find((entry) => String(entry.id) === req.params.id);
  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }
  // INTENTIONAL VULNERABILITY FOR DEMO
  return res.json(record);
}

function createRecord(req, res) {
  const nextId = demoData.records.length + 1;
  const record = {
    id: nextId,
    patient_id: req.body.patient_id,
    doctor_id: req.body.doctor_id,
    diagnosis: req.body.diagnosis,
    prescription: req.body.prescription,
    notes: req.body.notes,
    created_at: new Date().toISOString(),
  };

  demoData.records.push(record);
  return res.status(201).json(record);
}

module.exports = { listRecords, getRecordById, createRecord };
