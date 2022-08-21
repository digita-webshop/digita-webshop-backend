const controller = require("./controller");

module.exports = new (class extends controller {
  async getOrderById(req, res, next) {
    const orderId = req.params.oid;
    this.checkParamsId(orderId);

    const order = await this.Order.findById(orderId)
      .populate("productId")
      .populate("userId");

    if (!order) {
      return next(createError(404, "Order not found"));
    }
    this.response({
      res,
      message: "Order found",
      data: order,
    });
  }

  async getOrdersByUserId(req, res, next) {
    const userId = req.params.uid;
    this.checkParamsId(userId);

    const userWithOrders = await this.User.findById(userId).populate("orders");

    if (!userWithOrders || userWithOrders.orders.length === 0) {
      return next(createError(404, "User has no orders"));
    }
    this.response({
      res,
      message: "User orders found",
      data: userWithOrders.orders.map((order) => order.populate("productId")),
    });
  }

  async addOrder(req, res, next) {
    const newOrder = new this.Order({
      ...req.body,
      userId: req.user.id,
    });

    const user = await this.User.findById(req.user.id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await newOrder.save({ session: sess });
      user.orders.push(newOrder);
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      return next(createError(500, "Adding order failed, please try again."));
    }

    this.response({
      res,
      message: "Order created",
      data: newOrder,
    });
  }

  async deleteOrder(req, res, next) {
    const orderId = req.params.oid;
    this.checkParamsId(orderId);

    const order = await this.Order.findById(orderId).populate("userId");

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    if (order.userId.id !== req.user.id) {
      return next(
        createError(401, "You are not authorized to delete this order")
      );
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await order.remove({ session: sess });
      order.userId.orders.pull(order);
      await order.userId.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      return next(createError(500, "Deleting order failed, please try again."));
    }

    this.response({
      res,
      message: "Order deleted",
      data: order,
    });
  }
})();
