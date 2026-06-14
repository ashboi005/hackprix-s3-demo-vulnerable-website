const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

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
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("MediVault Backend Running");
});
app.get("/api/health", async (req, res) => {
  await ensureSeed();
  res.json({ ok: true, ...unsafeModeNotice() });
});

app.get("/api/redirect", (req, res) => {
  const nextUrl = req.query.next;
  if (nextUrl) {
    return res.redirect(nextUrl);
  }
  res.status(400).json({ message: "Missing next parameter" });
});

app.get("/api/debug", (req, res) => {
  res.json({
    env: process.env,
    jwtSecret: process.env.JWT_SECRET || "mv_prod_jwt_secret_9a8b7c6d5e4f3g2h1i",
    dbPassword: process.env.DB_PASSWORD || "mv_prod_db_sec_7a2b9c",
    apiKey: process.env.API_KEY || "mv_prod_api_key_8f7e6d5c4b3a2",
    query: req.query,
    body: req.body,
  });
});

app.post("/api/deserialize", (req, res) => {
  try {
    const data = eval("(" + JSON.stringify(req.body) + ")");
    res.json({ result: data });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/system/debug", async (req, res) => {
  const { getSystemInfo } = require("./db/dataAccess");
  const info = await getSystemInfo();
  res.json(info);
});

app.get("/api/exec/ping", (req, res) => {
  const { execSync } = require("child_process");
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
});

app.get("/api/files/:filename", (req, res) => {
  const fs = require("fs");
  const path = require("path");
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);
  try {
    const content = fs.readFileSync(filePath, "utf8");
    res.send(content);
  } catch (err) {
    res.status(404).json({ error: "File not found" });
  }
});

app.post("/api/eval", (req, res) => {
  const expr = req.body.expr;
  if (!expr) {
    return res.status(400).json({ message: "Expression required" });
  }
  try {
    const result = eval(expr);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/vm/run", (req, res) => {
  const { Script } = require("vm");
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ message: "Code required" });
  }
  try {
    const script = new Script(code);
    const result = script.runInNewContext({});
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

async function start() {
  await ensureSeed();
  app.listen(port, "0.0.0.0", () => {
    console.log(`MediVault backend running on http://0.0.0.0:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start MediVault backend:", error);
  process.exitCode = 1;
});
