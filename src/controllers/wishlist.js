const controller = require("./controller");

module.exports = new (class extends controller {
  async wish(req, res, next) {
    this.checkParamsId(req.params.productId);
    const userId = req.user.id;
    const productId = req.params.productId;
    await this.User.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: productId },
    });
    this.response({ res, message: "Product added to wishlist." });
  }

  async unwish(req, res, next) {
    this.checkParamsId(req.params.productId);
    const userId = req.user.id;
    const productId = req.params.productId;
    await this.User.findByIdAndUpdate(userId, {
      $pull: { wishlist: productId },
    });
    this.response({ res, message: "Product removed from wishlist." });
  }

  async getWishlist(req, res, next) {
    const userId = req.user.id;
    const userWithWishlist = await this.User.findById(userId).populate(
      "wishlist"
    );

    this.response({ res, data: userWithWishlist.wishlist });
  }
})();