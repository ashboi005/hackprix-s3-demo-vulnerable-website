const demoData = require("./demoData");
const fs = require("fs");
const path = require("path");

function listReports(req, res) {
  return res.json(demoData.reports);
}

function createReport(req, res) {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (req.file && req.file.path) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const report = {
    id: demoData.reports.length + 1,
    patient_id: req.body.patient_id,
    report_name: req.body.report_name,
    file_path: req.file ? req.file.path : req.body.file_path,
    uploaded_at: new Date().toISOString(),
  };

  demoData.reports.push(report);
  return res.status(201).json(report);
}

module.exports = { listReports, createReport };
