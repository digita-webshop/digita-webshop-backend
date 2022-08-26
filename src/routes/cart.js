const express = require("express");
const router = express.Router();
const { addToCart, getCart } = require("../controllers/cart");

// ADD PRODUCT TO CART
router.post("/", addToCart);

// GET PRODUCTS FROM CART
router.get("/", getCart);

module.exports = router;
