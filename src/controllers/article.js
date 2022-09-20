const mongoose = require("mongoose");
const controller = require("./controller");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async createArticle(req, res, next) {
    const newArticle = new this.Article(req.body);
    let savedArticle;
    try {
      savedArticle = await newArticle.save();
    } catch (err) {
      return next(
        createError(500, "Could not create article, please try again.")
      );
    }

    this.response({
      res,
      message: "Article created successfully",
      data: savedArticle,
    });
  }

  async updateArticle(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let updatedArticle;
    try {
      updatedArticle = await this.Article.findByIdAndUpdate(
        req.params.id,
        { $set: { ...req.body } },
        { new: true }
      );
    } catch (err) {
      return next(
        createError(500, "Could not update article, please try again.")
      );
    }

    this.response({
      res,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  }

  async deleteArticle(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    try {
      await this.Article.findByIdAndDelete(req.params.id);
    } catch (err) {
      return next(
        createError(500, "Could not delete article, please try again.")
      );
    }

    this.response({ res, message: "Article deleted successfully" });
  }

  async getArticle(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let article;
    try {
      article = await this.Article.findById(req.params.id);
    } catch (err) {
      return next(createError(500, "Could not get article, please try again."));
    }

    this.response({
      res,
      message: "Article found successfully",
      data: article,
    });
  }

  async getArticles(req, res, next) {
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    let articles;
    try {
      articles = await this.Article.find()
        .populate("reviews.userId")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
    } catch (err) {
      return next(
        createError(500, "Could not get articles, please try again.")
      );
    }

    this.response({
      res,
      message: "Articles found successfully",
      data: articles,
    });
  }

  async getArticleReviews(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 20;
    let article;
    try {
      article = await this.Article.findById(req.params.id)
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
    } catch (err) {
      return next(
        createError(500, "Fetching article reviews failed, please try again.")
      );
    }

    const list = await Promise.all(
      article.reviews.map((reviewer) => {
        try {
          return this.User.findById(reviewer.userId);
        } catch (err) {
          return next(
            createError(500, "Fetching user failed, please try again.")
          );
        }
      })
    );

    this.response({
      res,
      message: "Article reviews found successfully",
      data: list,
    });
  }
})();
