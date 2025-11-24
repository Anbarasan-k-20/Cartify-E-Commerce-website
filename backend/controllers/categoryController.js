
//D:\E Commerce Website\backend\controllers\categoryController.js
import Category from "../models/Category.js";
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};
