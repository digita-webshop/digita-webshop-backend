const controller = require("./controller");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async createProduct(req, res, next) {
    const newProduct = new this.Product(req.body);
    try {
      const savedProduct = await newProduct.save();
    } catch (err) {
      return next(
        createError(500, "Could not create product, please try again.")
      );
    }

    this.response({
      res,
      message: "Product created successfully",
      data: savedProduct,
    });
  }

  async updateProduct(req, res, next) {
    this.checkParamsId(req.params.id);
    try {
      const updatedProduct = await this.Product.findByIdAndUpdate(
        req.params.id,
        { $set: { image: req.file.path, ...req.body } },
        { new: true }
      );
    } catch (err) {
      return next(
        createError(500, "Could not update product, please try again.")
      );
    }

    this.response({
      res,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }

  async deleteProduct(req, res, next) {
    this.checkParamsId(req.params.id);
    try {
      await this.Product.findByIdAndDelete(req.params.id);
    } catch (err) {
      return next(
        createError(500, "Could not delete product, please try again.")
      );
    }

    this.response({ res, message: "Product deleted successfully" });
  }

  async getProduct(req, res, next) {
    this.checkParamsId(req.params.id);
    try {
      const product = await this.Product.findById(req.params.id);
    } catch (err) {
      return next(createError(500, "Could not get product, please try again."));
    }

    this.response({
      res,
      message: "Product found successfully",
      data: product,
    });
  }

  async getProducts(req, res, next) {
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    try {
      const products = await this.Product.find()
        .populate("reviews.userId")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
    } catch (err) {
      return next(
        createError(500, "Could not get products, please try again.")
      );
    }
    this.response({
      res,
      message: "Products found successfully",
      data: products,
    });
  }

  async getProductReviews(req, res, next) {
    this.checkParamsId(req.params.id);

    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 20;
    try {
      const product = await this.Product.findById(req.params.id)
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
    } catch (err) {
      return next(
        createError(500, "Could not get product reviews, please try again.")
      );
    }
    const list = await Promise.all(
      product.reviews.map((reviewer) => {
        try {
          return this.User.findById(reviewer.userId);
        } catch (err) {
          return next(
            createError(500, "Could not get product reviews, please try again.")
          );
        }
      })
    );

    this.response({
      res,
      message: "Product reviews found successfully",
      data: list,
    });
  }
})();
