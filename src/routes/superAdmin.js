const express = require("express");
const router = express.Router();

const { wish, unwish, getWishlist } = require("./../controllers/wishlist");

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
router.delete("/orders/:oid", deleteOrder);

// ADD product to wishlist
router.post("/wish/:productId", wish);

// DELETE a product from wishlist
router.delete("/wish/:productId", unwish);

// GET wishlist
router.get("/wishlist", getWishlist);

module.exports = router;
