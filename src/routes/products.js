const express = require("express");
const router = express.Router();

const { createProduct, deleteProduct, getProduct, getProducts, updateProduct } = require("../controllers/product");

const {
  addProductReview,
  getProductsReviews,
  deleteProductReview,
  getReviewsByProductId,
} = require("./../controllers/review");

const { verifyAdmin, verifyUser } = require("./../middlewares/verifyToken");

//CREATE PRODUCT
router.post("/", verifyAdmin, createProduct);

//UPDATE PRODUCT
router.put("/:id", verifyAdmin, updateProduct);

//DELETE PRODUCT
router.delete("/:id", verifyAdmin, deleteProduct);

//GET PRODUCT
router.get("/find/:id", getProduct);

//GET ALL PRODUCTS
router.get("/", getProducts);

// GET ALL PRODUCTS REVIEWS
router.get("/reviews", getProductsReviews);

// VALIDATOR FOR ADD PRODUCT REVIEW
const validator = require("./../validators/review");

//ADD PRODUCT REVIEW
router.post("/reviews/:id", verifyUser, validator.reviewValidator(), validator.validate, addProductReview);

//DELETE PRODUCT REVIEW
router.delete("/:pid/reviews/:id", verifyUser, deleteProductReview);

// GET REVIEWS BY PRODUCT ID
router.get("/reviews/:pid", getReviewsByProductId);

module.exports = router;
