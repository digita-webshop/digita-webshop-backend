const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} = require("./../controllers/user");

const { verifyAdmin } = require("./../middlewares/verifyToken");

//UPDATE
router.put("/:id", updateUser);

//DELETE
router.delete("/:id", deleteUser);

//GET
router.get("/:id", getUser);

//GET ALL
router.get("/", verifyAdmin, getUsers);

module.exports = router;
