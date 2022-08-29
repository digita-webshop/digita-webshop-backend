const controller = require("./controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = new (class extends controller {
  async signup(req, res) {
    let newUser = await this.User.findOne({ email: req.body.email });
    if (newUser) {
      return this.response({
        res,
        code: 422,
        message: "User exists already, please login instead.",
      });
    }

    newUser = new this.User(
      _.pick(req.body, ["userName", "email", "password"])
    );

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    this.response({
      res,
      message: "User created successfully",
      data: _.pick(newUser, ["_id", "userName", "email"]),
    });
  }

  async login(req, res) {
    const user = await this.User.findOne({ email: req.body.email });
    if (!user) {
      return this.response({
        res,
        code: 404,
        message: "User not found!",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return this.response({
        res,
        code: 400,
        message: "Wrong password or username!",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.get("jwt_key"),
      { expiresIn: "5d" }
    );

    const { password, role, ...otherDetails } = user._doc;

    this.response({
      res: res.cookie("access_token", token, {
        httpOnly: true,
      }),
      message: "Login successful",
      data: { details: { ...otherDetails }, role },
    });
  }
})();
