const autoBind = require("auto-bind");
const User = require("../models/userModel");

module.exports = class {
  constructor() {
    autoBind(this);
    this.User = User;
  }

  response({ res, message, code = 200, data = {} }) {
    res.status(code).json({
      message,
      data,
    });
  }
};
