// controllers/productController.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { uploadToCloudinary } from "../middleware/uploadImage.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// get product by clicking the product

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      category,
      brand,
      discountPrice,
      stock,
      sizes,
      rate,
      count,
    } = req.body;

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
      price,
      description,
      category: existingCategory.name,
      image: imageUrl,
      brand,
      discountPrice: discountPrice || 0,
      stock: stock || 0,
      sizes: sizes ? JSON.parse(sizes) : [],
      rating: {
        rate: rate || 0,
        count: count || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.log("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// upload Product details as collection
export const importProductsJSON = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No JSON file uploaded",
      });
    }

    // Parse JSON
    const productsArray = JSON.parse(req.file.buffer.toString("utf-8"));

    if (!Array.isArray(productsArray)) {
      return res.status(400).json({
        success: false,
        message: "JSON must be an array of products",
      });
    }

    const validProducts = [];

    for (let item of productsArray) {
      // Quick validation - only check absolute essentials
      if (
        !item.title ||
        !item.price ||
        !item.description ||
        !item.category ||
        !item.image
      ) {
        continue; // Skip invalid products silently
      }

      // Find or create category
      let category = await Category.findOne({ name: item.category });
      if (!category) {
        category = await Category.create({ name: item.category });
      }

      validProducts.push({
        title: String(item.title).trim(),
        price: Number(item.price),
        description: String(item.description).trim(),
        category: category.name,
        image: String(item.image).trim(),
        brand: item.brand ? String(item.brand).trim() : "",
        discountPrice: item.discountPrice ? Number(item.discountPrice) : 0,
        stock: item.stock ? Number(item.stock) : 0,
        sizes: Array.isArray(item.sizes) ? item.sizes : [],
        rating: {
          rate: item.rating?.rate ? Number(item.rating.rate) : 0,
          count: item.rating?.count ? Number(item.rating.count) : 0,
        },
      });
    }

    if (validProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found in JSON file",
      });
    }

    // FIX: Add error handling for bulk insert
    const createdProducts = await Product.insertMany(validProducts, { ordered: false });

    res.status(201).json({
      success: true,
      message: `${createdProducts.length} products imported successfully`,
      imported: createdProducts.length,
      total: productsArray.length,
    });
  } catch (error) {
    console.error("Import Error:", error);
    res.status(500).json({
      success: false,
      message: "Error importing products",
      error: error.message,
    });
  }
};