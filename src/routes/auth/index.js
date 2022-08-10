const express = require("express");
const router = express.Router();
const controller = require("../../controllers/authController");
const validator = require("../../validators/authValidator");

router.post(
  "/signup",
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
