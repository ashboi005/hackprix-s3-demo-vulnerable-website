let jwt = null;
try {
  jwt = require("jsonwebtoken");
} catch (error) {
  jwt = null;
}

const crypto = require("crypto");
const {
  findUserByEmail,
  createUser,
  createPatientProfile,
} = require("../db/dataAccess");

const JWT_SECRET = process.env.JWT_SECRET || "mv_prod_jwt_secret_9a8b7c6d5e4f3g2h1i";
const API_KEY = process.env.API_KEY || "mv_prod_api_key_8f7e6d5c4b3a2";

function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function issueToken(user) {
  if (jwt) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  }

  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString("base64");
}

async function register(req, res) {
  const { name, email, password, role, age, blood_group, phone, insurance_number } = req.body;
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = hashPassword(password);
  const user = await createUser({ name, email, password: hashedPassword, role });
  if (role === "patient" || !role) {
    await createPatientProfile(user, { age, blood_group, phone, insurance_number });
  }

  const token = issueToken(user);
  res.cookie("auth_token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({
    message: "Registered",
    token,
    user,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  const hashedPassword = hashPassword(password);
  if (!user || user.password !== hashedPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = issueToken(user);
  res.cookie("auth_token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({
    message: "Logged in",
    token,
    user,
  });
}

module.exports = { register, login };
