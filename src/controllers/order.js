const controller = require("./controller");

module.exports = new (class extends controller {
  async getAllOrders(req, res, next) {
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    const orders = await this.Order.find()
      .populate("productId")
      .populate("userId")
      .sort({ _id: 1 })
      .skip((pageNumber - 1) * nPerPage)
      .limit(nPerPage);

    if (!orders) {
      return next(createError(404, "Orders not found"));
    }
    this.response({
      res,
      message: "Orders found",
      data: orders,
    });
  }

  async getOrdersByUserId(req, res, next) {
    this.checkParamsId(req.params.uid);

    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 6;
    const userWithOrders = await this.User.findById(req.params.uid)
      .populate("orders")
      .sort({ _id: 1 })
      .skip((pageNumber - 1) * nPerPage)
      .limit(nPerPage);

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
      await newOrder.save();
      user.orders.push(newOrder);
      await user.save();
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
    this.checkParamsId(req.params.oid);

    const order = await this.Order.findById(req.params.oid).populate("userId");

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    if (order.userId.id !== req.user.id) {
      return next(
        createError(401, "You are not authorized to delete this order")
      );
    }

    try {
      await order.remove();
      order.userId.orders.pull(order);
      await order.userId.save();
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
