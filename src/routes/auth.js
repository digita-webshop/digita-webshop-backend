const express = require("express");
const router = express.Router();
const fileUpload = require("../middlewares/fileUpload");
const controller = require("../controllers/auth");
const validator = require("../validators/auth");

router.post(
  "/signup",
  fileUpload.single("image"),
  validator.signupValidator(),
  validator.validate,
  controller.signup
);

router.post(
  "/login",
  validator.loginValidator(),
  validator.validate,
  controller.login
);

module.exports = router;
