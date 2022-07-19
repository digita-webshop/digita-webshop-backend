const mongoose = require("mongoose");

const CategoryShcema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "نام دسته بندی الزامی میباشد"],
    unique: [true, "نام دسته بندی نباید تکراری باشد"],
  },
  img: {
    type: String,
    require: [true, "آپلود عکس برای دسته بندی الزامی میباشد"],
  },
  createdAt: { type: Date, default: Date.now() },
});

const Category = mongoose.model("Category", CategoryShcema);

module.exports = Category;
