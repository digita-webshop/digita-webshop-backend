const mongoose = require("mongoose");
const controller = require("./controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async createAdmin(req, res, next) {
    let newAdmin;
    try {
      newAdmin = await this.User.findOne({ email: req.body.email });
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not find a Admin.")
      );
    }

    if (newAdmin) {
      return this.response({
        res,
        code: 422,
        message: "Admin exists already, please login instead.",
      });
    }

    newAdmin = await this.User(
      _.pick(req.body, ["userName", "email", "password"])
    );

    newAdmin.role = "admin";
    try {
      const salt = await bcrypt.genSalt(10);
      newAdmin.password = await bcrypt.hash(newAdmin.password, salt);
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not create a Admin.")
      );
    }

    try {
      await newAdmin.save();
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not create a Admin.")
      );
    }

    return this.response({
      res,
      message: "Admin created",
      data: _.pick(newAdmin, ["_id", "userName", "email"]),
    });
  }

  async updateAdmin(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let updatedAdmin;
    try {
      updatedAdmin = await this.User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ...req.body },
        },
        { new: true }
      );
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not update admin.")
      );
    }
    if (!updatedAdmin) {
      return this.response({
        res,
        code: 404,
        message: "Admin not found!",
      });
    }
    this.response({
      res,
      message: "Admin updated successfully",
      data: _.pick(updatedAdmin, ["_id", "userName", "email"]),
    });
  }

  async deleteAdmin(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let admin;
    try {
      admin = await this.User.findByIdAndDelete(req.params.id);
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not delete admin.")
      );
    }
    if (!admin) {
      return this.response({
        res,
        code: 404,
        message: "Admin not found!",
      });
    }
    this.response({
      res,
      message: "Admin deleted successfully",
      data: _.pick(admin, ["_id", "userName", "email"]),
    });
  }

  async getAdmin(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    let admin;
    try {
      admin = await this.User.findById(req.params.id);
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not find admin.")
      );
    }
    if (!admin)
      return this.response({
        res,
        code: 404,
        message: "Admin not found!",
      });
    this.response({
      res,
      message: "Admin found successfully",
      data: _.pick(admin, ["_id", "userName", "email"]),
    });
  }

  async getAdmins(req, res, next) {
    let admins;
    try {
      admins = await this.User.find({ role: "admin" }, "-password");
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not find admins.")
      );
    }
    this.response({
      res,
      message: "Admins found successfully",
      data: admins,
    });
  }
})();
