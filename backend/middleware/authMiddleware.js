let jwt = null;
try {
  jwt = require("jsonwebtoken");
} catch (error) {
  jwt = null;
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    if (jwt) {
      req.user = jwt.verify(token, process.env.JWT_SECRET || "demo-secret");
    } else {
      req.user = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    }
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
}

module.exports = authMiddleware;
