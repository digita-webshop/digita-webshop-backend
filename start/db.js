const mongoose = require("mongoose");
const debug = require("debug")("app:start:db");
const config = require("config");

const PORT = config.get("PORT") || 5000;

module.exports = function (app) {
  mongoose
    .connect(config.get("db.MONGO_URI"))
    .then(() =>
      // listen for requests
      app.listen(PORT, () => {
        debug(`connected to db & Server running on port ${PORT}`);
      })
    )
    .catch(() => debug("could not connect to db"));
};
