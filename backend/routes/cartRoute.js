import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
import {
  getCartList,
  addToCart,
  deleteCartItem,
  increaseQty,
  decreaseQty,
} from "../controllers/cartList.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js"; // ✅ new middleware

const router = express.Router();

// ✅ Cart actions require login (user or admin)
router.get("/", protect, authorizeRoles("user", "admin"), getCartList);
router.post("/", protect, authorizeRoles("user", "admin"), addToCart);
router.delete("/:id", protect, authorizeRoles("user", "admin"), deleteCartItem);

router.patch(
  "/increase/:id",
  protect,
  authorizeRoles("user", "admin"),
  increaseQty
);
router.patch(
  "/decrease/:id",
  protect,
  authorizeRoles("user", "admin"),
  decreaseQty
);

export default router;
