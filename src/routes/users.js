const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} = require("./../controllers/user");

const fileUpload = require("../middlewares/fileUpload");
const { verifyAdmin } = require("./../middlewares/verifyToken");

const {
  addOrder,
  deleteOrder,
  getAllOrders,
  getOrdersByUserId,
} = require("./../controllers/order");

//UPDATE USER
router.put("/:id", fileUpload.single("image"), updateUser);

//DELETE USER
router.delete("/:id", verifyAdmin, deleteUser);

//GET USER
router.get("/:id", getUser);

//GET ALL USERS
router.get("/", verifyAdmin, getUsers);

// GET ALL ORDERS
router.get("/orders", verifyAdmin, getAllOrders);

// GET ORDERS BY USER ID
router.get("/my-orders/:uid", getOrdersByUserId);

// VALIDATOR FOR ADD ORDER
const validator = require("./../validators/order");

// ADD ORDER
router.post("/order", validator.orderValidator(), validator.validate, addOrder);

// DELETE ORDER
router.delete("/orders/:oid", deleteOrder);


module.exports = router;
