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
