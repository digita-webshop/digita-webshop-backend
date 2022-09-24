const express = require("express");
const router = express.Router();

const {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  updateArticle,
} = require("../controllers/article");

const {
  addArticleReview,
  getArticlesReviews,
  deleteArticleReview,
  getReviewsByArticleId,
} = require("./../controllers/review");

const { verifyAdmin, verifyUser } = require("./../middlewares/verifyToken");

//CREATE ARTICLE
router.post("/", verifyAdmin, createArticle);

//UPDATE ARTICLE
router.put("/:id", verifyAdmin, updateArticle);

//DELETE ARTICLE
router.delete("/:id", verifyAdmin, deleteArticle);

//GET ARTICLE
router.get("/find/:id", getArticle);

//GET ALL ARTICLES
router.get("/", getArticles);

// GET ALL ARTICLES REVIEWS
router.get("/reviews", verifyAdmin, getArticlesReviews);

// VALIDATOR FOR ADD ARTICLE REVIEW
const validator = require("./../validators/review");

//ADD ARTICLE REVIEW
router.post(
  "/reviews/:id",
  verifyUser,
  validator.reviewValidator(),
  validator.validate,
  addArticleReview
);

//DELETE ARTICLE REVIEW
router.delete("/:aid/reviews/:id", verifyUser, deleteArticleReview);

// GET REVIEWS BY ARTICLE ID
router.get("/reviews/:aid", getReviewsByArticleId);

module.exports = router;
