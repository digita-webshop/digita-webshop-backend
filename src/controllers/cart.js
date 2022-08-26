const controller = require("./controller");

module.exports = new (class extends controller {
  async addToCart(req, res) {
    const { productId, quantity, name, price } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

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
      cart = await cart.save();
      return this.response({
        res,
        code: 201,
        message: "Cart updated successfully",
        data: cart,
      });
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
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
      const cart = await Cart.findOne({ userId }).populate("products.productId");
      return this.response({
        res,
        code: 200,
        message: "Cart retrieved successfully",
        data: cart,
      });
  }
})();
