const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    street: { type: String, trim: true },
    postalCode: { type: String, minlength: 10 },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, minlength: 10 },
    image: { type: String },
    addresses: [addressSchema],
    orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
