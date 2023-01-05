const mongoose = require("mongoose");
const controller = require("./controller");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async getProductsReviews(req, res, next) {
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    let reviews, totalReviews;
    try {
      reviews = await this.Review.find({ articleId: { $exists: false } })
        .populate("userId")
        .populate("productId")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
      totalReviews = await this.Review.countDocuments({
        articleId: { $exists: false },
      });
    } catch (err) {
      return next(createError(500, "Could not get reviews, please try again."));
    }

    this.response({
      res,
      message: "Reviews found",
      data: reviews,
      total: totalReviews,
    });
  }

  async getArticlesReviews(req, res, next) {
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    let reviews, totalReviews;
    try {
      reviews = await this.Review.find({ productId: { $exists: false } })
        .populate("userId")
        .populate("articleId")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
      totalReviews = await this.Review.countDocuments({
        productId: { $exists: false },
      });
    } catch (err) {
      return next(createError(500, "Could not get reviews, please try again."));
    }

    if (!reviews) {
      return next(createError(404, "Reviews not found"));
    }
    this.response({
      res,
      message: "Reviews found",
      data: reviews,
      total: totalReviews,
    });
  }

  async getReviewsByProductId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return next(createError(400, "Invalid id"));
    }

    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    let productWithReviews;
    try {
      productWithReviews = await this.Product.findById(req.params.pid)
        .populate("reviews")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
    } catch (err) {
      return next(createError(500, "Could not get reviews, please try again."));
    }

    if (!productWithReviews || productWithReviews.reviews.length === 0) {
      return next(createError(404, "Product has no reviews"));
    }
    this.response({
      res,
      message: "Product reviews found",
      data: productWithReviews.reviews,
    });
  }

  async getReviewsByArticleId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.aid)) {
      return next(createError(400, "Invalid id"));
    }

    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    let articleWithReviews;
    try {
      articleWithReviews = await this.Article.findById(req.params.aid)
        .populate("reviews")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
    } catch (err) {
      return next(createError(500, "Could not get reviews, please try again."));
    }

    if (!articleWithReviews || articleWithReviews.reviews.length === 0) {
      return next(createError(404, "Article has no reviews"));
    }
    this.response({
      res,
      message: "Article reviews found",
      data: articleWithReviews.reviews,
    });
  }

  async addProductReview(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }

    const newReview = new this.Review({
      ...req.body,
      userId: req.user.id,
      productId: req.params.id,
    });
    let product;
    try {
      product = await this.Product.findById(req.params.id).populate("reviews");
    } catch (err) {
      return next(createError(500, "Could not find product, please try again."));
    }

    if (!product) {
      return next(createError(404, "Product not found"));
    }
    try {
      await newReview.save();
      product.reviews.push(newReview);
      await product.save();
    } catch (err) {
      return next(createError(500, "Adding review failed, please try again."));
    }

    this.response({
      res,
      message: "Review created",
      data: newReview,
    });
  }

  async deleteProductReview(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid) || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let review;
    try {
      review = await this.Review.findById(req.params.id).populate("userId").populate("productId");
    } catch (err) {
      return next(createError(500, "Could not delete review, please try again."));
    }

    if (!review || !review.productId) {
      return next(createError(404, "Review not found"));
    }

    /* This is checking if the user is the owner of the review. */
    if (req.user.role === "user" && review.userId.id !== req.user.id) {
      return next(createError(401, "You are not allowed to delete this review"));
    }

    if (review.productId.id !== req.params.pid) {
      return next(createError(400, "Invalid product id"));
    }

    try {
      await review.remove();
      review.productId.reviews.pull(review);
      await review.productId.save();
    } catch (err) {
      return next(createError(500, "Deleting review failed, please try again."));
    }

    this.response({
      res,
      message: "Review deleted",
      data: review,
    });
  }

  async addArticleReview(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    const newReview = new this.Review({
      ...req.body,
      userId: req.user.id,
      articleId: req.params.id,
    });
    let article;
    try {
      article = await this.Article.findById(req.params.id).populate("reviews");
    } catch (err) {
      return next(createError(500, "Could not find article, please try again."));
    }

    if (!article) {
      return next(createError(404, "Article not found"));
    }
    try {
      await newReview.save();
      article.reviews.push(newReview);
      await article.save();
    } catch (err) {
      return next(createError(500, "Adding review failed, please try again."));
    }

    this.response({
      res,
      message: "Review created",
      data: newReview,
    });
  }

  async deleteArticleReview(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.aid) || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let review;
    try {
      review = await this.Review.findById(req.params.id).populate("userId").populate("articleId");
    } catch (err) {
      return next(createError(500, "Could not delete review, please try again."));
    }

    if (!review || !review.articleId) {
      return next(createError(404, "Review not found"));
    }

    if (review.articleId.id !== req.params.aid) {
      return next(createError(400, "Invalid article id"));
    }

    try {
      await review.remove();
      review.articleId.reviews.pull(review);
      await review.articleId.save();
    } catch (err) {
      return next(createError(500, "Deleting review failed, please try again."));
    }

    this.response({
      res,
      message: "Review deleted",
      data: review,
    });
  }
})();
