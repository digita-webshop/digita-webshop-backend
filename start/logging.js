/* Importing the express-async-errors, winston and debug modules. */
require("express-async-errors");
const winston = require("winston");
const debug = require("debug")("app:start:logging");

/* This is a function that is exporting the process.on("uncaughtException") and
process.on("unhandledRejection") functions. */
module.exports = function () {
  /* Listening for uncaught exceptions. */
  process.on("uncaughtException", (ex) => {
    debug(ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  /* Listening for unhandled rejections. */
  process.on("unhandledRejection", (ex) => {
    debug(ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  /* Adding a new transport to the winston module. */
  winston.add(new winston.transports.File({ filename: "logFile.log" }));
};
