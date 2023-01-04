const validator = require("./validator");
const { check } = require("express-validator");

module.exports = new (class extends validator {
  orderValidator() {
    return [check("productId").not().isEmpty().withMessage("Product Id is required")];
  }
})();
