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
    const query = req.query;
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;

    let filters = {};
    if (query?.category) {
      filters.category = { $in: query.category.split("/") };
    }
    if (query.search) {
      filters.title = {
        $regex: new RegExp(".*" + query.search.trim() + ".*", "ig"),
      };
    }

    let articles, totalArticles;
    try {
      articles = await this.Article.find(filters)
        .populate({
          path: "reviews",
          populate: { path: "userId", select: "userName email" },
        })
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
      totalArticles = await this.Article.countDocuments(filters);
    } catch (err) {
      return next(
        createError(500, "Could not get articles, please try again.")
      );
    }

    this.response({
      res,
      message: "Articles found successfully",
      data: articles,
      total: totalArticles,
    });
  }
})();
