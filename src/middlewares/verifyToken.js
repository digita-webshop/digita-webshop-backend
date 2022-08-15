const jwt = require("jsonwebtoken");
const config = require("config");
const createError = require("../utils/httpError");

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, config.get("jwt_key"), (err, user) => {
    if (err) next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.role) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role !== "user") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifySuperAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role === "superAdmin") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
