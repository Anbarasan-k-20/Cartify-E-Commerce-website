// D:\E Commerce Website\backend\controllers\cartList.js
import cartSchema from "../models/cartModel.js";

// GET CART LIST
//  FIX: Cart is now fetched ONLY for the logged-in user
//  REMOVED: extra `.find()` which was redundant and confusing

export const getCartList = async (req, res) => {
  try {
    const carts = await cartSchema
      .find({ user: req.user._id }) // CHANGED: user-specific cart
      .populate("productId")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: carts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Cart List",
      error: error.message,
    });
  }
};

//  FIX: Cart item is now unique per (user + product)
//  REMOVED: global product check (was causing shared carts)

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // NEW: get user from JWT

    const {
      productId,
      title,
      discountPrice,
      price,
      description,
      category,
      image,
      rating,
    } = req.body;

    if (
      !productId ||
      !title ||
      !price ||
      discountPrice === undefined ||
      !description ||
      !category ||
      !image
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // CHANGED: find cart item by BOTH user and product
    const existing = await cartSchema.findOne({
      user: userId,
      productId,
    });

    if (existing) {
      if (existing.quantity >= 5) {
        return res
          .status(400)
          .json({ success: false, message: "Max limit reached" });
      }
      existing.quantity += 1;
      await existing.save();
      return res.status(200).json({ success: true, data: existing });
    }

    //  CHANGED: save cart item with user reference
    const newItem = await cartSchema.create({
      user: userId, // NEW: link cart item to user
      productId,
      title,
      price,
      description,
      category,
      discountPrice,
      image,
      rating,
    });

    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

// DELETE CART ITEM
// FIX: Only the owner of the cart item can delete it
// REMOVED: findByIdAndDelete (security hole)

export const deleteCartItem = async (req, res) => {
  try {
    const deleted = await cartSchema.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // NEW: ownership check
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, message: "Item removed" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting cart item",
      error: error.message,
    });
  }
};

// INCREASE QUANTITY
// FIX: Only owner can modify quantity

export const increaseQty = async (req, res) => {
  try {
    const item = await cartSchema.findOne({
      _id: req.params.id,
      user: req.user._id, //NEW: ownership enforced
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (item.quantity >= 5) {
      return res.status(400).json({ message: "Max quantity reached" });
    }

    item.quantity += 1;
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ message: "Error updating qty" });
  }
};

// DECREASE QUANTITY
// FIX: Only owner can modify quantity

export const decreaseQty = async (req, res) => {
  try {
    const item = await cartSchema.findOne({
      _id: req.params.id,
      user: req.user._id, // NEW: ownership enforced
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (item.quantity <= 1) {
      return res.status(400).json({ message: "Min quantity is 1" });
    }

    item.quantity -= 1;
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ message: "Error updating qty" });
  }
};
