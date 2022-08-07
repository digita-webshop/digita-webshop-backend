const mongoose = require("mongoose");

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
        validator: function (v) {
          const emailRegex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return emailRegex.test(v);
        },
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
