const autoBind = require("auto-bind");

module.exports = class {
  constructor() {
    autoBind(this);
  }

  response({ res, message, code = 200, data = {} }) {
    res.status(code).json({
      message,
      data,
    });
  }
};
