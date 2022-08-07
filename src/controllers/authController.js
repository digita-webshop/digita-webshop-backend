const controller = require("./../controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");

module.exports = new (class extends controller {
  async register(req, res) {
    let user = await this.User.findOne({ email: req.body.email });
    if (user) {
      return this.response({
        res,
        code: 400,
        message: "User already exists",
      });
    }

    user = new this.User(_.pick(req.body, ["userName", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    this.response({
      res,
      message: "User created successfully",
      data: _.pick(user, ["_id", "userName", "email"]),
    });
  }
})();
