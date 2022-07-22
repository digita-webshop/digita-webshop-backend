const express = require("express");

// express app
const app = express();
const router = require("./src/routes");

require("./start/config")(app, express);
require("./start/db")(app);
require("./start/logging")();

// routes
app.use("/api", router);
