const controller = require("./controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = new (class extends controller {
  async signup(req, res) {
    let user = await this.User.findOne({ email: req.body.email });
    if (user) {
      return this.response({
        res,
        code: 422,
        message: "User exists already, please login instead.",
      });
    }

    user = new this.User(_.pick(req.body, ["userName", "email", "password"]));

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    this.response({
      res,
      message: "User created successfully",
      data: _.pick(user, ["_id", "userName", "email"]),
    });
  }

  async login(req, res) {
    const user = await this.User.findOne({ email: req.body.email });
    if (!user) {
      return this.response({
        res,
        code: 403,
        message: "Invalid credentials, could not log you in.",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return this.response({
        res,
        code: 403,
        message: "Invalid credentials, could not log you in.",
      });
    }

    const token = jwt.sign({ _id: user.id }, config.get("jwt_key"), {
      expiresIn: "1h",
    });
    this.response({ res, message: "Login successful", data: { token } });
  }
})();
