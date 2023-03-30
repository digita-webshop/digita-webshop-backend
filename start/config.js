const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

module.exports = function (app, express) {
  app.use(cors({ credentials: true, origin: ["https://digita-webshop.iran.liara.run", "http://localhost:3000"] }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads/images", express.static(path.join("uploads", "images")));
};
