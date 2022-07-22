const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const adminRouter = require("./admin");
const userRouter = require("./user");

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);

module.exports = router;
