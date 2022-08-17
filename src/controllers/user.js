const controller = require("./controller");
const _ = require("lodash");

module.exports = new (class extends controller {
  async updateUser(req, res, next) {
    this.checkParamsId(req.params.id);
    const updatedUser = await this.User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          image: req.body.image,
        },
      },
      { new: true }
    );
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
    const user = await this.User.findByIdAndDelete(req.params.id);
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
    const user = await this.User.findById(req.params.id);
    if (!user)
      return this.response({
        res,
        code: 404,
        message: "User not found!",
      });
    this.response({
      res,
      message: "User found successfully",
      data: _.pick(user, ["_id", "userName", "email"]),
    });
  }

  async getUsers(req, res, next) {
    const users = await this.User.find({}, "-password");
    this.response({
      res,
      message: "Users found successfully",
      data: users,
    });
  }
})();
