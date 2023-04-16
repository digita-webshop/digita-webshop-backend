const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./../src/swagger");

module.exports = function (app, express) {
  app.use(cors({ credentials: true, origin: ["https://digita-webshop.iran.liara.run", "http://localhost:3000", "http://localhost:8080"] }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads/images", express.static(path.join("uploads", "images")));
  // swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
