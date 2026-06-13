let jwt = null;
try {
  jwt = require("jsonwebtoken");
} catch (error) {
  jwt = null;
}
const demoData = require("./demoData");

function issueToken(user) {
  if (jwt) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "demo-secret");
  }

  // INTENTIONAL VULNERABILITY FOR DEMO
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString("base64");
}

function register(req, res) {
  const { name, email, password, role } = req.body;
  const user = {
    id: demoData.users.length + 1,
    name,
    email,
    password,
    role: role || "patient",
  };

  demoData.users.push(user);

  if (role === "patient") {
    demoData.patients.push({
      id: demoData.patients.length + 1,
      user_id: user.id,
      name,
      email,
      role,
      age: 30,
      blood_group: "O+",
      phone: "555-0000",
      insurance_number: "INS-DEMO",
    });
  }

  // INTENTIONAL VULNERABILITY FOR DEMO
  return res.json({
    message: "Registered",
    token: issueToken(user),
    user,
  });
}

function login(req, res) {
  const { email, password } = req.body;
  const user = demoData.users.find((entry) => entry.email === email && entry.password === password);

  if (!user) {
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
