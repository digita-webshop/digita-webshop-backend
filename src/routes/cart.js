const express = require("express");
const router = express.Router();
const { addToCart, addMultipleProducts, getCart, deleteCart } = require("../controllers/cart");

// ADD PRODUCT TO CART
router.post("/", addToCart);

// ADD MULTIPLE PRODUCTS TO CART AT ONCE
router.post("/add-multiple", addMultipleProducts);

// ADD PRODUCT TO CART
router.delete("/delete/:productId", deleteCart);

// GET PRODUCTS FROM CART
router.get("/", getCart);

module.exports = router;
