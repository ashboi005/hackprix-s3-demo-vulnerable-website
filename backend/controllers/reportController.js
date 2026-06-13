const fs = require("fs");
const path = require("path");
const {
  listReports: loadReports,
  createReport: storeReport,
  deleteReport: removeReport,
} = require("../db/dataAccess");

async function listReports(req, res) {
  return res.json(await loadReports());
}

async function createReport(req, res) {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (req.file && req.file.path) fs.mkdirSync(uploadsDir, { recursive: true });
  const filePath = req.file ? req.file.path : req.body.file_path;
  return res.status(201).json(await storeReport(req.body, filePath));
}

async function deleteReport(req, res) {
  const deleted = await removeReport(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Report not found" });
  return res.json({ deleted: true });
}

module.exports = { listReports, createReport, deleteReport };
