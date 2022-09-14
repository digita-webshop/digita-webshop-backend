const controller = require("./controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const createError = require("../utils/httpError");

module.exports = new (class extends controller {
  async signup(req, res) {
    let newUser;
    try {
      newUser = await this.User.findOne({ email: req.body.email });
    } catch (err) {
      return next(
        createError(500, "Something went wrong, could not find a User.")
      );
    }
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

    try {
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
    } catch (err) {
      return next(createError(500, "Could not create user, please try again."));
    }
    try {
      await newUser.save();
    } catch (err) {
      return next(
        createError(500, "Signing up failed, please try again later.")
      );
    }

    this.response({
      res,
      message: "User created successfully",
      data: _.pick(newUser, ["_id", "userName", "email"]),
    });
  }

  async login(req, res) {
    let user;
    try {
      user = await this.User.findOne({ email: req.body.email });
    } catch (err) {
      return next(
        createError(500, "Logging in failed, please try again later.")
      );
    }
    if (!user) {
      return this.response({
        res,
        code: 404,
        message: "User not found!",
      });
    }
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(req.body.password, user.password);
    } catch (err) {
      return next(
        createError(
          500,
          "Could not log you in, please check your credentials and try again."
        )
      );
    }
    if (!isValidPassword) {
      return this.response({
        res,
        code: 400,
        message: "Wrong password or username!",
      });
    }
    let token;
    try {
      token = jwt.sign(
        { id: user._id, role: user.role },
        config.get("jwt_key"),
        { expiresIn: "5d" }
      );
    } catch (err) {
      return next(
        createError(500, "Logging in failed, please try again later.")
      );
    }

    const { password, role, ...otherDetails } = user._doc;

    this.response({
      res: res.cookie("access_token", token),
      message: "Login successful",
      data: { details: { ...otherDetails }, role },
    });
  }
})();
