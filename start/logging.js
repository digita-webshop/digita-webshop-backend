const winston = require("winston");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logFile.log" }));
};
