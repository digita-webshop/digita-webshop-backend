const controller = require("./controller");
const _ = require("lodash");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async updateUser(req, res, next) {
    this.checkParamsId(req.params.id);
    let updatedUser;
    try {
      updatedUser = await this.User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ...req.body },
        },
        { new: true }
      );
    } catch (err) {
      return next(createError(500, "Updating user failed, please try again."));
    }

    if (!updatedUser) {
      return this.response({
        res,
        code: 404,
        message: "User not found!",
      });
    }
    this.response({
      res,
      message: "User updated successfully",
      data: _.pick(updatedUser, ["_id", "userName", "email"]),
    });
  }

  async deleteUser(req, res, next) {
    this.checkParamsId(req.params.id);
    let user;
    try {
      user = await this.User.findByIdAndDelete(req.params.id);
    } catch (err) {
      return next(createError(500, "Deleting user failed, please try again."));
    }
    if (!user) {
      return this.response({
        res,
        code: 404,
        message: "User not found!",
      });
    }
    this.response({
      res,
      message: "User deleted successfully",
      data: _.pick(user, ["_id", "userName", "email"]),
    });
  }

  async getUser(req, res, next) {
    this.checkParamsId(req.params.id);
    let user;
    try {
      user = await this.User.findById(req.params.id);
    } catch (err) {
      return next(
        createError(500, "Fetching user failed, please try again later.")
      );
    }
    if (!user)
      return this.response({
        res,
        code: 404,
        message: "User not found!",
      });
    this.response({
      res,
      message: "User found successfully",
      data: _.omit(user, ["password"]),
    });
  }

  async getUsers(req, res, next) {
    const pageNumber = parseInt(req.query.page) || 1;
    const nPerPage = parseInt(req.query.limit) || 20;
    let users;
    try {
      users = await this.User.find({ role: "user" }, "-password")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
    } catch (err) {
      return next(
        createError(500, "Fetching users failed, please try again later.")
      );
    }

    this.response({
      res,
      message: "Users found successfully",
      data: users,
    });
  }
})();
