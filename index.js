const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/swagger");

// express app
const app = express();
const router = require("./src/routes");


require("./start/config")(app, express);
require("./start/db")(app);
require("./start/logging")();


// routes
app.use("/api", router);

// swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));