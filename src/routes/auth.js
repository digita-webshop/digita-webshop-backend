const express = require("express");
const router = express.Router();
const { signup, login } = require("./../controllers/auth");
const validator = require("./../validators/auth");

//CREATE A USER
router.post("/signup", validator.signupValidator(), validator.validate, signup);

//LOGIN A USER
router.post("/login", validator.loginValidator(), validator.validate, login);

module.exports = router;
