const express = require("express");
const router = express.Router();
const controller = require("./../controllers/userController");

router.get("/", controller.dashboard);

router.get("/me", controller.me);

module.exports = router;
