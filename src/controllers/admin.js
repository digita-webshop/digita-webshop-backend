const controller = require("./controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");

module.exports = new (class extends controller {
  async createAdmin(req, res, next) {
    let newAdmin = await this.User.findOne({ email: req.body.email });
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
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);

    await newAdmin.save();

    return this.response({
      res,
      message: "Admin created",
      data: _.pick(newAdmin, ["_id", "userName", "email"]),
    });
  }

  async updateAdmin(req, res, next) {
    this.checkParamsId(req.params.id);
    const updatedAdmin = await this.User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { ...req.body, image: req.file.path },
      },
      { new: true }
    );

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
    this.checkParamsId(req.params.id);
    const admin = await this.User.findByIdAndDelete(req.params.id);
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
    this.checkParamsId(req.params.id);
    const admin = await this.User.findById(req.params.id);
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
    const admins = await this.User.find({ role: "admin" }, "-password");
    this.response({
      res,
      message: "Admins found successfully",
      data: admins,
    });
  }
})();
