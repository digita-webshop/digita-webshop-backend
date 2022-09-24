/* Importing the mongoose, debug and config modules. */
const mongoose = require("mongoose");
const debug = require("debug")("app:start:db");
const config = require("config");

/* Getting the port from the config file. If the port is not found, it will use 5000 as the default
port. */
const PORT = config.get("PORT") || 5000;

/* This is the code that is used to connect to the database. */
module.exports = async function (app) {
  await mongoose
    .connect(config.get("db.MONGO_URI"))
    .then(() =>
      // listen for requests
      app.listen(PORT, () => {
        debug(`connected to db & Server running on port ${PORT}`);
      })
    )
    .catch(() => debug("could not connect to db"));
  mongoose.connection.on("disconnected", () => {
    debug("disconnected from db");
  });
};
