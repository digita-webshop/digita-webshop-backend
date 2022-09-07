const express = require("express");
const router = express.Router();

const { createFile } = require("../controllers/file");

const { verifyAdmin } = require("./../middlewares/verifyToken");

//upload file
router.post("/upload", verifyAdmin, createFile);

module.exports = router;
