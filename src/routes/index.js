const express = require("express");
const router = express.Router();

const error = require("./../middlewares/error");
const { isLoggedIn, isAdmin, isSuperAdmin } = require("./../middlewares/auth");

const authRouter = require("./auth");
const userRouter = require("./user");
const adminRouter = require("./admin");
const superAdminRouter = require('./superAdmin')

router.use("/auth", authRouter);
router.use("/user", isLoggedIn, userRouter);
router.use("/admin", isLoggedIn, isAdmin, adminRouter);
router.use("/superAdmin", isLoggedIn, isAdmin, isSuperAdmin, superAdminRouter)

router.use(error);

module.exports = router;
