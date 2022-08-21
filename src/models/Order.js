const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Types.ObjectId, required: true , ref: "Product" },
    status: {
      type: String,
      required: true,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
    },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
