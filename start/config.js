/* Importing the cors, cookie-parser, and path modules. */
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

/* This is a function that is exporting the middleware that is being used in the app. */
module.exports = function (app, express) {
  /* Allowing the server to accept requests from other domains. */
  app.use(cors());
  /* Parsing the cookies that are being sent to the server. */
  app.use(cookieParser());
  /* Parsing the JSON that is being sent to the server. */
  app.use(express.json());
  /* This is parsing the URL encoded data that is being sent to the server. */
  app.use(express.urlencoded({ extended: true }));
  /* This is allowing the server to access the images that are being uploaded to the server. */
  app.use("/uploads/images", express.static(path.join("uploads", "images")));
};
