import express from "express";
import {
  canUserReview,
  addReview,
  getReviewsByProduct,
} from "../controllers/orderReviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/can-review/:productId", protect, canUserReview);
router.post("/", protect, addReview);
router.get("/:productId", getReviewsByProduct);

export default router;
