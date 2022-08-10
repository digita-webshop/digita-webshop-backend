const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

async function isLoggedIn(req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) throw new Error("Authentication failed!");
    const decoded = jwt.verify(token, config.get("jwt_key"));
    const user = await User.findById(decoded._id);
    req.user = user;
    next();
  } catch (ex) {
    return res.status(403).send("Authentication failed!");
  }
}

async function isAdmin(req, res, next) {
  if (req.user.role === "user") return res.status(403).send("Access denied.");
  next();
}

async function isSuperAdmin(req, res, next) {
  if (req.user.role !== "superAdmin")
    return res.status(403).send("Access denied.");
  next();
}

module.exports = {
  isLoggedIn,
  isAdmin,
  isSuperAdmin,
};
