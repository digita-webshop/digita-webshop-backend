const controller = require("./controller");
const createError = require("../utils/httpError");
module.exports = new (class extends controller {
  async addToCart(req, res) {
    const { productId, quantity, name, price } = req.body;
    const userId = req.user.id;
    let cart;
    try {
      cart = await this.Cart.findOne({ userId });
    } catch (err) {
      return next(createError(500, "Could not find cart, please try again."));
    }

    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex((p) => p.productId === productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productId, quantity, name, price });
      }
      try {
        cart = await cart.save();
      } catch (err) {
        return next(
          createError(500, "Could not update cart, please try again.")
        );
      }
      return this.response({
        res,
        code: 201,
        message: "Cart updated successfully",
        data: cart,
      });
    } else {
      //no cart for user, create new cart
      const newCart = await this.Cart.create({
        userId,
        products: [{ productId, quantity, name, price }],
      });

      return this.response({
        res,
        code: 201,
        message: "Cart created successfully",
        data: newCart,
      });
    }
  }

  async getCart(req, res) {
    const userId = req.user.id;
    let cart;
    try {
      cart = await this.Cart.findOne({ userId }).populate("products.productId");
    } catch (err) {
      return next(createError(500, "Could not find cart, please try again."));
    }
    return this.response({
      res,
      code: 200,
      message: "Cart retrieved successfully",
      data: cart,
    });
  }
})();
