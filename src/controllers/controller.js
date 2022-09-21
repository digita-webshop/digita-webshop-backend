const autoBind = require("auto-bind");
const User = require("./../models/User");
const Product = require("./../models/Product");
const Article = require("./../models/Article");
const Order = require("./../models/Order");
const Cart = require("./../models/Cart");
const Review = require("./../models/Review");

module.exports = class {
  constructor() {
    autoBind(this);
    this.Cart = Cart;
    this.User = User;
    this.Order = Order;
    this.Review = Review;
    this.Article = Article;
    this.Product = Product;
  }

  response({ res, message, code = 200, data = {}, total }) {
    res.status(code).json({
      code,
      message,
      data,
      total,
    });
  }
};
