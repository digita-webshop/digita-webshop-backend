const validator = require("./validator");
const { check } = require("express-validator");

module.exports = new (class extends validator {
  cartValidator() {
    return [
      check("quantity")
        .not()
        .isEmpty()
        .withMessage("quantity is required")
        .isNumeric()
        .withMessage("quantity must be a number"),
    ];
  }
})();
