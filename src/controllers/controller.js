const autoBind = require("auto-bind");
const mongoose = require("mongoose");
const createError = require("./../utils/httpError");
const User = require("./../models/User");
const Product = require("./../models/Product");
const Article = require("./../models/Article");
const Order = require("./../models/Order");
const Cart = require("./../models/Cart");

module.exports = class {
  constructor() {
    autoBind(this);
    this.User = User;
    this.Product = Product;
    this.Article = Article;
    this.Order = Order;
    this.Cart = Cart;
  }

  checkParamsId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid id"));
    }
  }

  response({ res, message, code = 200, data = {} }) {
    res.status(code).json({
      message,
      data,
    });
  }
};
