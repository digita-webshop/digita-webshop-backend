const express = require("express");
const router = express.Router();

const {
  addOrder,
  deleteOrder,
  getOrdersByUserId,
} = require("./../controllers/order");

// GET ORDERS BY USER ID
router.get("/my-orders/:uid", getOrdersByUserId);

// VALIDATOR FOR ADD ORDER
const validator = require("./../validators/order");

// ADD ORDER
router.post("/order", validator.orderValidator(), validator.validate, addOrder);

// DELETE ORDER
router.delete("/order/:oid", deleteOrder);

module.exports = router;
