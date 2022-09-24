/* Importing the required modules. */
const mongoose = require("mongoose");
const controller = require("./controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  /**
   * It creates a new admin user
   * @param req - The request object.
   * @param res - The response object
   * @param next - This is a function that you call when you want to pass control to the next middleware
   * function in the stack.
   * @returns The response is being returned.
   */
  async createAdmin(req, res, next) {
    /* Checking if the admin exists already. */
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

    /* Creating a new user object. */
    newAdmin = await this.User(
      _.pick(req.body, ["userName", "email", "password"])
    );

    newAdmin.role = "admin";
    /* Hashing the password. */
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

    /* Returning the response to the client. */
    return this.response({
      res,
      message: "Admin created",
      data: _.pick(newAdmin, ["_id", "userName", "email"]),
    });
  }

  /* It updates an admin */
  async updateAdmin(req, res, next) {
    /* Checking if the id is valid or not. */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }

/* This is a middleware function that is checking if the user is a superAdmin or not. If the user is
not a superAdmin, then it is checking if the user is trying to update his own profile or not. If the
user is not trying to update his own profile, then it is returning an error. */
    const userId = req.user.id;
    if (req.user.role !== "superAdmin" && userId !== req.params.id) {
      return next(
        createError(401, "You are not authorized to update this user")
      );
    }
    /* Updating the admin. */
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

    /* Checking if the admin exists or not. */
    if (!updatedAdmin) {
      return this.response({
        res,
        code: 404,
        message: "Admin not found!",
      });
    }

    /* Checking if the password is being updated or not. If it is being updated, then it is hashing the
    password. */
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        updatedAdmin.password = await bcrypt.hash(updatedAdmin.password, salt);
      } catch (err) {
        return next(
          createError(500, "Something went wrong, could not update a admin.")
        );
      }
    }

    /* Saving the updated admin to the database. */
    try {
      await updatedAdmin.save();
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not update a admin.")
      );
    }

    /* Returning the response to the client. */
    this.response({
      res,
      message: "Admin updated successfully",
      data: _.pick(updatedAdmin, ["_id", "userName", "email", "phone"]),
    });
  }

  /* It deletes an admin from the database */
  async deleteAdmin(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    /* Deleting an admin from the database. */
    let admin;
    try {
      admin = await this.User.findByIdAndDelete(req.params.id);
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not delete admin.")
      );
    }
    /* Checking if the admin exists or not. If it does not exist, then it is returning a response to the
client. */
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

  /**
   * It gets an admin by id
   * @returns The admin object is being returned.
   */
  async getAdmin(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid id"));
    }
    /* Getting an admin by id. */
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

  /**
   * It gets all the admins from the database and returns them to the user
   * @returns An array of admins and the total number of admins.
   */
  async getAdmins(req, res, next) {
    /* Getting all the admins with their total number from the database. */
    let admins, totalAdmins;
    try {
      admins = await this.User.find({ role: "admin" }, "-password");
      totalAdmins = await this.User.countDocuments({ role: "admin" });
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not find admins.")
      );
    }
    this.response({
      res,
      message: "Admins found successfully",
      data: admins,
      total: totalAdmins,
    });
  }
})();
