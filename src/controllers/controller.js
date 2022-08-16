const autoBind = require("auto-bind");
const User = require("../models/User");
const mongoose = require("mongoose");
const createError = require("./../utils/httpError");

module.exports = class {
  constructor() {
    autoBind(this);
    this.User = User;
  }

  checkParamsId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid id"));
    }
  }

  response({ res, message, code = 200, data = {} }) {
    res.status(code).json({
      message,
      data,
    });
  }
};
