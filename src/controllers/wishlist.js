const controller = require("./controller");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async wish(req, res, next) {
    this.checkParamsId(req.params.productId);
    const userId = req.user.id;
    const productId = req.params.productId;
    try {
      await this.User.findByIdAndUpdate(userId, {
        $addToSet: { wishlist: productId },
      });
    } catch (err) {
      return next(
        createError(500, "Could not add product to wishlist, please try again.")
      );
    }

    this.response({ res, message: "Product added to wishlist." });
  }

  async unwish(req, res, next) {
    this.checkParamsId(req.params.productId);
    const userId = req.user.id;
    const productId = req.params.productId;
    try {
      await this.User.findByIdAndUpdate(userId, {
        $pull: { wishlist: productId },
      });
    } catch (err) {
      return next(
        createError(
          500,
          "Could not remove product from wishlist, please try again."
        )
      );
    }

    this.response({ res, message: "Product removed from wishlist." });
  }

  async getWishlist(req, res, next) {
    const userId = req.user.id;
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    let userWithWishlist;
    try {
      userWithWishlist = await this.User.findById(userId)
        .populate("wishlist")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
    } catch (err) {
      return next(
        createError(500, "Could not get wishlist, please try again.")
      );
    }

    this.response({ res, data: userWithWishlist.wishlist });
  }
})();
