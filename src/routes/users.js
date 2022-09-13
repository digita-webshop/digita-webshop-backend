const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} = require("./../controllers/user");

const { verifyAdmin } = require("./../middlewares/verifyToken");
const { wish, unwish, getWishlist } = require("./../controllers/wishlist");

const {
  addOrder,
  deleteOrder,
  getAllOrders,
  getOrdersByUserId,
} = require("./../controllers/order");

//UPDATE USER
router.put("/:id", updateUser);

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

// ADD product to wishlist
router.post("/wish/:productId", wish);

// DELETE a product from wishlist
router.delete("/wish/:productId", unwish);

// GET wishlist
router.get("/wishlist", getWishlist);

module.exports = router;
