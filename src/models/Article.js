const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    image: { type: String, trim: true },
    description: { type: String, trim: true },
    writer: { type: String, trim: true },
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
    category: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
