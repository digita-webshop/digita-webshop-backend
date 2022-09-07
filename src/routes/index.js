const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const cartRoutes = require("./cart");
const userRoutes = require("./users");
const adminRoutes = require("./admins");
const articleRoutes = require("./articles");
const productRoutes = require("./products");
const superAdminRoutes = require("./superAdmin");
const fileRoutes = require("./superAdmin");

const {
  verifyUser,
  verifyAdmin,
  verifySuperAdmin,
} = require("./../middlewares/verifyToken");

const error = require("./../middlewares/error");

// Auth routes
router.use("/auth", authRoutes);

// Cart routes
router.use("/cart", verifyUser, cartRoutes);

// ARTICLES routes
router.use("/articles", articleRoutes);

// PRODUCTS routes
router.use("/products", productRoutes);

// USER routes
router.use("/users", verifyUser, userRoutes);

// ADMIN routes
router.use("/admins", verifyAdmin, adminRoutes);

// SUPER ADMIN routes
router.use("/superAdmin", verifySuperAdmin, superAdminRoutes);

// FILE UPLOAD routes
router.use("/file", verifySuperAdmin, fileRoutes);

// Error middleware
router.use(error);

module.exports = router;
