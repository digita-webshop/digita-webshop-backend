const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    image: {
      type: String,
    },
    gallery: [
      {
        type: gallerySchema,
        validate: {
          validator: function (v) {
            return v && v.length <= 6;
          },
          message: "Gallery can be a maximum of 6 images.",
        },
      },
    ],
    offPrice: { type: Number, min: 0, max: 100 },
    price: { type: Number },
    rating: { type: Number, min: 0, max: 5 },
    quantity: { type: Number },
    sku: { type: String, trim: true },
    colors: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length <= 3;
        },
        message: "Colors can be a maximum of 3 items.",
      },
    },
    category: { type: String, trim: true },
    tags: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length <= 3;
        },
        message: "tags can be a maximum of 3 items.",
      },
    },
    shortDescription: { type: String, trim: true },
    fullDescription: { type: String, trim: true },
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
    brand: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
