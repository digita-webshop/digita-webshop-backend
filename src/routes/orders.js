const express = require("express");
const router = express.Router();
const { getOrders } = require("../controllers/order");
const { verifyAdmin } = require("./../middlewares/verifyToken");

// GET ALL ORDERS
router.get("/", verifyAdmin, getOrders);

module.exports = router;
