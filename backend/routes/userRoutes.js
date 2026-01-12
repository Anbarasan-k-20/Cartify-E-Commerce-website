//D:\E Commerce Website\backend\routes\userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET logged-in user profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      phone: req.user.phone || "",
    },
  });
});

export default router;
