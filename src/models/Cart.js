const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        name: String,
        price: Number,
        color: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
