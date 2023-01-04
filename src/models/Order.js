const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        name: String,
        price: Number,
      },
    ],
    date: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    address: { type: Object },
    notes: { type: String },
    coupon: { type: String },
    status: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
    },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
