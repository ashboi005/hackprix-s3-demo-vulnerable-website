let jwt = null;
try {
  jwt = require("jsonwebtoken");
} catch (error) {
  jwt = null;
}

const {
  findUserByEmail,
  createUser,
  createPatientProfile,
} = require("../db/dataAccess");

function issueToken(user) {
  if (jwt) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "demo-secret");
  }

  // INTENTIONAL VULNERABILITY FOR DEMO
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString("base64");
}

async function register(req, res) {
  const { name, email, password, role, age, blood_group, phone, insurance_number } = req.body;
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await createUser({ name, email, password, role });
  if (role === "patient" || !role) {
    await createPatientProfile(user, { age, blood_group, phone, insurance_number });
  }

  // INTENTIONAL VULNERABILITY FOR DEMO
  return res.json({
    message: "Registered",
    token: issueToken(user),
    user,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // INTENTIONAL VULNERABILITY FOR DEMO
  return res.json({
    message: "Logged in",
    token: issueToken(user),
    user,
  });
}

module.exports = { register, login };
