const {
  listRecords: loadRecords,
  getRecordById: loadRecordById,
  createRecord: storeRecord,
  updateRecord: storeRecordUpdate,
  deleteRecord: removeRecord,
} = require("../db/dataAccess");

async function listRecords(req, res) {
   
  return res.json(await loadRecords());
}

async function getRecordById(req, res) {
  const record = await loadRecordById(req.params.id);
  if (!record) return res.status(404).json({ message: "Record not found" });
   
  return res.json(record);
}

async function createRecord(req, res) {
  return res.status(201).json(await storeRecord(req.body));
}

async function updateRecord(req, res) {
  const record = await storeRecordUpdate(req.params.id, req.body);
  if (!record) return res.status(404).json({ message: "Record not found" });
  return res.json(record);
}

async function deleteRecord(req, res) {
  const deleted = await removeRecord(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Record not found" });
  return res.json({ deleted: true });
}

module.exports = { listRecords, getRecordById, createRecord, updateRecord, deleteRecord };
