const validator = require("./validator");
const { check } = require("express-validator");

module.exports = new (class extends validator {
  signupValidator() {
    return [
      check("userName").not().isEmpty().withMessage("User Name is required"),
      check("email")
        .normalizeEmail()
        .isEmail()
        .withMessage("Email is not valid"),
      check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ];
  }

  loginValidator() {
    return [
      check("email")
        .normalizeEmail()
        .isEmail()
        .withMessage("Email is not valid"),
      check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ];
  }
})();
