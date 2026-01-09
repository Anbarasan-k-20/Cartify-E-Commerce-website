import Review from "../models/Review.js";
import Order from "../models/placeOrderModel.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

//✅ CHECK IF USER CAN REVIEW
export const canUserReview = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId } = req.params;

    const order = await Order.findOne({
      userId,
      productId,
    });

    if (!order) {
      return res.json({ canReview: false });
    }

    const alreadyReviewed = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.json({ canReview: false });
    }

    res.json({ canReview: true });
  } catch (err) {
    res.status(500).json({ canReview: false });
  }
};

/* ✅ ADD REVIEW + UPDATE PRODUCT RATING */

export const addReview = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId, rating, comment } = req.body;

    // 1️⃣ Validate input
    if (!productId || !rating || !comment?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ STRICT purchase check (THIS WAS MISSING / WRONG)
    const order = await Order.findOne({
      userId: userId,
      productId: productId,
    });

    if (!order) {
      return res.status(403).json({
        message: "You are not eligible to review this product",
      });
    }

    // 3️⃣ Prevent duplicate review
    const alreadyReviewed = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    // 4️⃣ Create review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ GET REVIEWS BY PRODUCT
 */
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "fullname")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("getReviewsByProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
