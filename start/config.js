const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

module.exports = function (app, express) {
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads/images", express.static(path.join("uploads", "images")));
};
