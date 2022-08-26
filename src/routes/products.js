const express = require("express");
const router = express.Router();

const {
  createProduct,
  deleteProduct,
  getProduct,
  getProductReviews,
  getProducts,
  updateProduct,
} = require("../controllers/product");

const fileUpload = require("../middlewares/fileUpload");
const { verifyAdmin } = require("./../middlewares/verifyToken");

//CREATE PRODUCT
router.post("/", verifyAdmin, fileUpload.single("image"), createProduct);

//UPDATE PRODUCT
router.put("/:id", verifyAdmin, fileUpload.single("image"), updateProduct);

//DELETE PRODUCT
router.delete("/:id", verifyAdmin, deleteProduct);

//GET PRODUCT
router.get("/find/:id", getProduct);

//GET ALL PRODUCTS
router.get("/", getProducts);

//GET PRODUCT REVIEWS
router.get("/reviews/:id", verifyAdmin, getProductReviews);

module.exports = router;
