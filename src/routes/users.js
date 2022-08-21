const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} = require("./../controllers/user");

const fileUpload = require("./../middlewares/fileUpload");

const { verifyAdmin } = require("./../middlewares/verifyToken");

//UPDATE
router.put("/:id", fileUpload.single("image"), updateUser);

//DELETE
router.delete("/:id", verifyAdmin, deleteUser);

//GET
router.get("/:id", getUser);

//GET ALL
router.get("/", verifyAdmin, getUsers);

module.exports = router;
