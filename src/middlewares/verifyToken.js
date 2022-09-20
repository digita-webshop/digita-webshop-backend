const jwt = require("jsonwebtoken");
const config = require("config");
const createError = require("../utils/httpError");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, config.get("jwt_key"), async (err, user) => {
      if (err) return next(createError(401, "Token is not valid!"));
      req.user = user;
      next();
    });
  } catch (err) {
    return next(createError(403, "Authentication failed!"));
  }
};

const verifyUser = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.role) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  } catch (err) {
    return next(createError(403, "Authentication failed!"));
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.role !== "user") {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  } catch (err) {
    return next(createError(403, "Authentication failed!"));
  }
};

const verifySuperAdmin = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.role === "superAdmin") {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  } catch (err) {
    return next(createError(403, "Authentication failed!"));
  }
};

module.exports = {
  verifyUser,
  verifyAdmin,
  verifySuperAdmin,
};
