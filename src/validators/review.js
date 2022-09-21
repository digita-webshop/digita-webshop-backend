const validator = require("./validator");
const { check } = require("express-validator");

module.exports = new (class extends validator {
  reviewValidator() {
    return [
      check("rating").not().isEmpty().withMessage("rating is required"),
      check("description")
        .not()
        .isEmpty()
        .withMessage("description is required"),
    ];
  }
})();
