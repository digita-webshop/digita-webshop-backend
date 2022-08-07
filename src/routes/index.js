const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("./../middlewares/auth");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const userRouter = require("./user");

router.use("/auth", authRouter);
router.use("/admin", isLoggedIn, adminRouter);
router.use("/user", isLoggedIn, userRouter);

module.exports = router;
