import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { uploadToCloudinary } from "../middleware/uploadImage.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { title, price, description, category, rate, count } = req.body;

    if (!title || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, description, and category are required",
      });
    }

    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const product = await Product.create({
      title,
      price: parseFloat(price),
      description,
      category: existingCategory.name,
      image: imageUrl,
      rating: {
        rate: rate ? parseFloat(rate) : 0,
        count: count ? parseInt(count) : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};
