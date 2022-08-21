const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    image: { type: String, trim: true },
    description: { type: String, trim: true },
    writer: { type: String, trim: true },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
