const express = require("express");
const router = express.Router();

const {
  getOrderById,
  getOrdersByUserId,
  addOrder,
  deleteOrder,
} = require("./../controllers/order");

const validator = require("./../validators/order");

router.get("/:oid", getOrderById);

router.get("/user/:uid", getOrdersByUserId);

router.post("/", validator.orderValidator(), validator.validate, addOrder);

router.delete("/:oid", deleteOrder);

module.exports = router;
