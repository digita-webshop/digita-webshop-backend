const winston = require("winston");

module.exports = (err, req, res, next) => {
  winston.error(err.message, err);
  res.status(err.status).json({ message: err.message });
};
