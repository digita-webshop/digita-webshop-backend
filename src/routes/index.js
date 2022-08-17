const express = require("express");
const router = express.Router();

const { error } = require("./../middlewares/error");
const {
  verifyUser,
  verifyAdmin,
  verifySuperAdmin,
} = require("./../middlewares/verifyToken");

const authRouter = require("./auth");
const usersRouter = require("./users");
const adminsRouter = require("./admins");
const superAdminRouter = require("./superAdmin");

router.use("/auth", authRouter);
router.use("/user", verifyUser, usersRouter);
router.use("/panel/admin", verifyUser, verifyAdmin, adminsRouter);
router.use(
  "/panel/superAdmin",
  verifyUser,
  verifyAdmin,
  verifySuperAdmin,
  superAdminRouter
);

router.use(error);

module.exports = router;
