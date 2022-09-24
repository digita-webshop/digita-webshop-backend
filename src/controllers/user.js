const mongoose = require("mongoose");
const controller = require("./controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async updateUser(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }

    /* This is a middleware that checks if the user is authorized to update the user. */
    const userId = req.user.id;
    if (req.user.role === "user" && userId !== req.params.id) {
      return next(
        createError(401, "You are not authorized to update this user")
      );
    }

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

    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        updatedUser.password = await bcrypt.hash(updatedUser.password, salt);
      } catch (err) {
        return next(
          createError(500, "Something went wrong, could not update a user.")
        );
      }
    }

    try {
      await updatedUser.save();
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not update a user.")
      );
    }

    this.response({
      res,
      message: "User updated successfully",
      data: _.pick(updatedUser, ["_id", "userName", "email", "phone"]),
    });
  }

  async deleteUser(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
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
    let users, totalUsers;
    try {
      users = await this.User.find({ role: "user" }, "-password")
        .sort({ _id: 1 })
        .skip((pageNumber - 1) * nPerPage)
        .limit(nPerPage);
      totalUsers = await this.User.countDocuments({ role: "user" });
    } catch (err) {
      return next(
        createError(500, "Fetching users failed, please try again later.")
      );
    }

    this.response({
      res,
      message: "Users found successfully",
      data: users,
      total: totalUsers,
    });
  }
})();
