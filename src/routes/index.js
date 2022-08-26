const express = require("express");
const router = express.Router();

const { error } = require("./../middlewares/error");
const {
  verifyUser,
  verifyAdmin,
  verifySuperAdmin,
} = require("./../middlewares/verifyToken");

const authRoutes = require("./auth");
const cartRoutes = require("./cart");
const userRoutes = require("./users");
const adminRoutes = require("./admins");
const articleRoutes = require("./articles");
const productRoutes = require("./products");
const superAdminRoutes = require("./superAdmin");

router.use("/auth", authRoutes);
router.use("/cart", verifyUser, cartRoutes);
router.use("/articles", articleRoutes);
router.use("/products", productRoutes);
router.use("/user", verifyUser, userRoutes);
router.use("/panel/admin", verifyUser, verifyAdmin, adminRoutes);
router.use(
  "/panel/superAdmin",
  verifyUser,
  verifyAdmin,
  verifySuperAdmin,
  superAdminRoutes
);

router.use(error);

module.exports = router;
