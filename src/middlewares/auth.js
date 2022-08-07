const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

async function isLoggedIn(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, config.get("jwt_key"));
    const user = await User.findById(decoded._id);
    req.user = user;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

async function isAdmin(req, res, next) {
  if (req.user.role === "user") res.status(403).send("Access denied.");
  next();
}

module.exports = {
  isLoggedIn,
  isAdmin,
};
