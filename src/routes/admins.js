const express = require("express");
const router = express.Router();

const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
} = require("./../controllers/admin");

const fileUpload = require("../middlewares/fileUpload");
const { verifySuperAdmin } = require("./../middlewares/verifyToken");

// CREATE ADMIN
router.post("/", verifySuperAdmin, fileUpload.single("image"), createAdmin);

//UPDATE ADMIN
router.put("/:id", fileUpload.single("image"), updateAdmin);

//DELETE ADMIN
router.delete("/:id", verifySuperAdmin, deleteAdmin);

//GET ADMIN
router.get("/:id", getAdmin);

//GET ALL ADMINS
router.get("/", verifySuperAdmin, getAdmins);

module.exports = router;
