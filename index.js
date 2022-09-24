/* Importing the express module. */
const express = require("express");

/* Creating an express app. */
const app = express();
/* Importing the routes file. */
const router = require("./src/routes");

/* Importing the config, db and logging files. */
require("./start/config")(app, express);
require("./start/db")(app);
require("./start/logging")();

// routes
/* Telling the app to use the router file for all requests that start with /api. */
app.use("/api", router);
