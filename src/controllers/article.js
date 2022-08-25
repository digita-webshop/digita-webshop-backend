const controller = require("./controller");

module.exports = new (class extends controller {
  async createArticle(req, res, next) {
    const newArticle = new this.Article(req.body);
    newArticle.image = req.file.path;
    const savedArticle = await newArticle.save();

    this.response({
      res,
      message: "Article created successfully",
      data: savedArticle,
    });
  }

  async updateArticle(req, res, next) {
    this.checkParamsId(req.params.id);
    const updatedArticle = await this.Article.findByIdAndUpdate(
      req.params.id,
      { $set: { image: req.file.path, ...req.body } },
      { new: true }
    );

    this.response({
      res,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  }

  async deleteArticle(req, res, next) {
    this.checkParamsId(req.params.id);
    await this.Article.findByIdAndDelete(req.params.id);

    this.response({ res, message: "Article deleted successfully" });
  }

  async getArticle(req, res, next) {
    this.checkParamsId(req.params.id);
    const article = await this.Article.findById(req.params.id);

    this.response({
      res,
      message: "Article found successfully",
      data: article,
    });
  }

  async getArticles(req, res, next) {
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    const articles = await this.Article.find()
      .populate("reviews.userId")
      .sort({ _id: 1 })
      .skip((pageNumber - 1) * nPerPage)
      .limit(nPerPage);

    this.response({
      res,
      message: "Articles found successfully",
      data: articles,
    });
  }

  async getArticleReviews(req, res, next) {
    this.checkParamsId(req.params.id);
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 20;
    const article = await this.Article.findById(req.params.id)
      .sort({ _id: 1 })
      .skip((pageNumber - 1) * nPerPage)
      .limit(nPerPage);

    const list = await Promise.all(
      article.reviews.map((reviewer) => {
        return this.User.findById(reviewer.userId);
      })
    );

    this.response({
      res,
      message: "Article reviews found successfully",
      data: list,
    });
  }
})();
