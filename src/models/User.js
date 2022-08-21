const mongoose = require("mongoose");
const { emailValidator } = require("./../validators/custom");

const addressSchema = new mongoose.Schema(
  {
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    street: { type: String, trim: true },
    postalCode: { type: String, minlength: 10, unique: true },
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
      validate: {
        validator: emailValidator,
        message: "Invalid email format",
      },
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, unique: true, minlength: 10 },
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
