const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 0, max: 5, required: true },
    description: { type: String, trim: true, required: true },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    articleId: {
      type: mongoose.Types.ObjectId,
      ref: "Article",
    },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
