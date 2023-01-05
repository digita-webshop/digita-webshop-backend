const mongoose = require("mongoose");
const controller = require("./controller");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async wish(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return next(createError(400, "Invalid id"));
    }
    const userId = req.user.id;
    const productId = req.params.productId;
    try {
      await this.User.findByIdAndUpdate(userId, {
        $addToSet: { wishlist: productId },
      });
    } catch (err) {
      return next(createError(500, "Could not add product to wishlist, please try again."));
    }

    this.response({ res, message: "Product added to wishlist." });
  }

  async unwish(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return next(createError(400, "Invalid id"));
    }
    const userId = req.user.id;
    const productId = req.params.productId;
    try {
      await this.User.findByIdAndUpdate(userId, {
        $pull: { wishlist: productId },
      });
    } catch (err) {
      return next(createError(500, "Could not remove product from wishlist, please try again."));
    }

    this.response({ res, message: "Product removed from wishlist." });
  }

  async getWishlist(req, res, next) {
    const userId = req.user.id;
    let userWithWishlist, totalWishlist;
    try {
      userWithWishlist = await this.User.findById(userId).populate("wishlist").sort({ _id: 1 });
      totalWishlist = userWithWishlist.wishlist.length;
    } catch (err) {
      return next(createError(500, "Could not get wishlist, please try again."));
    }
    if (!userWithWishlist) {
      return next(createError(404, "wishlist not found"));
    }

    this.response({
      res,
      data: userWithWishlist.wishlist,
      total: totalWishlist,
    });
  }
})();
