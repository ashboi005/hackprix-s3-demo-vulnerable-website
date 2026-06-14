const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
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

async function downloadReport(req, res) {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  const content = fs.readFileSync(filePath, "utf8");
  res.send(content);
}

async function pingHost(req, res) {
  const host = req.query.host;
  if (!host) {
    return res.status(400).json({ message: "Host parameter required" });
  }
  try {
    const output = execSync("ping -c 1 " + host, { encoding: "utf8" });
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deserializeData(req, res) {
  try {
    const data = eval("(" + JSON.stringify(req.body) + ")");
    res.json({ result: data });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { listReports, createReport, deleteReport, downloadReport, pingHost, deserializeData };
