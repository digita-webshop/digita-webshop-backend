const validator = require("./validator");
const { check } = require("express-validator");

module.exports = new (class extends validator {
  registerValidator() {
    return [
      check("userName").not().isEmpty().withMessage("User Name is required"),
      check("email").isEmail().withMessage("Email is not valid"),
      check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ];
  }
})();
