const mongoose = require("mongoose");
const { numberItemsValidator } = require("./../validators/custom");

const gallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 0, max: 5 },
    description: { type: String, trim: true },
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
          validator: numberItemsValidator.bind(this, 6),
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
        validator: numberItemsValidator.bind(this, 3),
        message: "Colors can be a maximum of 3 items.",
      },
    },
    category: { type: String, trim: true },
    tags: {
      type: [String],
      validate: {
        validator: numberItemsValidator.bind(this, 3),
        message: "tags can be a maximum of 3 items.",
      },
    },
    shortDescription: { type: String, trim: true },
    fullDescription: { type: String, trim: true },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
