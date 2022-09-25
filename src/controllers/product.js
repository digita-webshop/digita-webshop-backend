const mongoose = require("mongoose");
const controller = require("./controller");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async createProduct(req, res, next) {
    const newProduct = new this.Product(req.body);
    let savedProduct;
    try {
      savedProduct = await newProduct.save();
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let updatedProduct;
    try {
      updatedProduct = await this.Product.findByIdAndUpdate(
        req.params.id,
        { $set: { ...req.body } },
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let product;
    try {
      product = await this.Product.findById(req.params.id);
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
    const query = req.query;
    const pageNumber = parseInt(query.page) || 1;
    const nPerPage = parseInt(query.limit) || 6;

    let filters = {};
    if (query?.category) {
      filters.category = { $in: query.category.split("/") };
    }
    if (query?.color) {
      filters.colors = { $in: query.color.split("/") };
    }
    if (query?.price) {
      let min = query.price.split("/")[0].replace(/^\D+/g, "");
      let max = query.price.split("/")[1].replace(/^\D+/g, "");
      filters.price = { $gte: min, $lte: max };
    }
    let sort = { _id: -1 };
    if (query?.sort) {
      if (query.sort === "rating") {
        sort = { rating: 1 };
      }
      if (query.sort === "latest") {
        sort = { createdAt: -1 };
      }
      if (query.sort === "price-low-to-high") {
        sort = { price: 1 };
      }
      if (query.sort === "price-high-to-low") {
        sort = { price: -1 };
      }
    }
    if (query.search) {
      filters.title = {
        $regex: new RegExp(".*" + query.search.trim() + ".*", "ig"),
      };
    }

    let products, totalProducts;
    try {
      products = await this.Product.find(filters)
        .populate("reviews.userId")
        .sort(sort)
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
      totalProducts = await this.Product.countDocuments(filters);
    } catch (err) {
      return next(
        createError(500, "Could not get products, please try again.")
      );
    }
    this.response({
      res,
      message: "Products found successfully",
      data: products,
      total: totalProducts,
    });
  }
})();
