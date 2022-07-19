const express = require("express");
const indexController = require("../controller/indexController");

const router = express.Router();

router.get("/", indexController.hello);

module.exports = router;
