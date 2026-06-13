const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { ensureSeed, unsafeModeNotice } = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const recordRoutes = require("./routes/recordRoutes");
const reportRoutes = require("./routes/reportRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", async (req, res) => {
  await ensureSeed();
  res.json({ ok: true, ...unsafeModeNotice() });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use((err, req, res, next) => {
  // INTENTIONAL VULNERABILITY FOR DEMO
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

async function start() {
  await ensureSeed();
  app.listen(port, () => {
    console.log(`MediVault backend running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start MediVault backend:", error);
  process.exitCode = 1;
});
