import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,  
} from "../controllers/placeOrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//  User Routes
router.post("/place-order", protect, placeOrder); // Place order
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
export default router;