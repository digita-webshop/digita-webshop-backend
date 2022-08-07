const winston = require("winston");
const debug = require("debug")("app:start:logging");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logFile.log" }));
};
