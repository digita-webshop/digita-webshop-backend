const controller = require("./controller");

module.exports = new (class extends controller {
  async createProduct(req, res, next) {
    const newProduct = new this.Product(req.body);
    newProduct.image = req.file.path;
    const savedProduct = await newProduct.save();

    this.response({
      res,
      message: "Product created successfully",
      data: savedProduct,
    });
  }

  async updateProduct(req, res, next) {
    this.checkParamsId(req.params.id);
    const updatedProduct = await this.Product.findByIdAndUpdate(
      req.params.id,
      { $set: { image: req.file.path, ...req.body } },
      { new: true }
    );

    this.response({
      res,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }

  async deleteProduct(req, res, next) {
    this.checkParamsId(req.params.id);
    await this.Product.findByIdAndDelete(req.params.id);

    this.response({ res, message: "Product deleted successfully" });
  }

  async getProduct(req, res, next) {
    this.checkParamsId(req.params.id);
    const product = await this.Product.findById(req.params.id);

    this.response({
      res,
      message: "Product found successfully",
      data: product,
    });
  }

  async getProducts(req, res, next) {
    const products = await this.Product.find()
      .populate("reviews.userId")

    this.response({
      res,
      message: "Products found successfully",
      data: products,
    });
  }

  async getProductReviews(req, res, next) {
    this.checkParamsId(req.params.id);

    const product = await this.Product.findById(req.params.id)

    const list = await Promise.all(
      product.reviews.map((reviewer) => {
        return this.User.findById(reviewer.userId);
      })
    );

    this.response({
      res,
      message: "Product reviews found successfully",
      data: list,
    });
  }
})();
