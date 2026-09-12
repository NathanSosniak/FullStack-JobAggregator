const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies["access_token"];
  if (!token) {
    return res.status(401).json({ msg: "Not allowed" });
  }
  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Not allowed" });
    }
    req.token = decoded;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.token && req.token.role === "admin") {
    next();
  } else {
    return res.status(403).json({ msg: "Not allowed" });
  }
}

module.exports = { auth, isAdmin };
