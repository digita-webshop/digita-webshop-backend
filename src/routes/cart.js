const express = require("express");
const router = express.Router();
const { addToCart, getCart, deleteCart } = require("../controllers/cart");

// ADD PRODUCT TO CART
router.post("/", addToCart);

// ADD PRODUCT TO CART
router.delete("/delete/:productId", deleteCart);

// GET PRODUCTS FROM CART
router.get("/", getCart);

module.exports = router;
