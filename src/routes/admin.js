const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("admin router"));

module.exports = router;
