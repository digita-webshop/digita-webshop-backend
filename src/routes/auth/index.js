const express = require("express");
const router = express.Router();
const controller = require("../../controllers/authController");
const validator = require("../../validators/authValidator");

router.post(
  "/register",
  validator.registerValidator(),
  validator.validate,
  controller.register
);

router.post(
  "/login",
  validator.loginValidator(),
  validator.validate,
  controller.login
);

module.exports = router;
