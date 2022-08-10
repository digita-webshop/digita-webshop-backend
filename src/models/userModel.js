const mongoose = require("mongoose");
import { emailValidator } from "../validators/customValidator";

const addressSchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  street: String,
  postalCode: { type: String, minlength: 10 },
});

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
  ],
});

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, lowercase: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: emailValidator,
        message: "Invalid email",
      },
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, unique: true, minlength: 10 },
    image: { type: String },
    addresses: [addressSchema],
    orders: [orderSchema],
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
