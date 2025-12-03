import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/placeOrderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ User Routes
router.post("/place-order", protect, placeOrder); // Place order
router.get("/", protect, getUserOrders); // Get user's orders
router.get("/:id", protect, getOrderById); // Get single order
router.patch("/cancel/:id", protect, cancelOrder); // Cancel order

// ✅ Admin Routes
router.get("/all/orders", protect, authorizeRoles("admin"), getAllOrders); // Get all orders
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateOrderStatus
); // Update order status

export default router;