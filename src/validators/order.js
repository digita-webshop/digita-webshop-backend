const validator = require("./validator");
const { check } = require("express-validator");

module.exports = new (class extends validator {
  orderValidator() {
    return [
      check("productId").not().isEmpty().withMessage("Product Id is required"),
      check("status").not().isEmpty().withMessage("Status is required"),
      check("userId").not().isEmpty().withMessage("User Id is required"),
    ];
  }
})();
