// backend/controllers/productController.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { uploadToCloudinary } from "../middleware/uploadImage.js";
import XLSX from "xlsx";

//Validate external image URLs (used in import)
const isValidUrl = (value) => {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
//Normalize product object (used for JSON / Excel imports)
const normalizeProductObject = async (raw) => {
  if (!raw || typeof raw !== "object") return null;

  const title = raw.title ? String(raw.title).trim() : "";
  const price = raw.price !== undefined ? Number(raw.price) : NaN;
  const description = raw.description ? String(raw.description).trim() : "";
  const categoryName = raw.category ? String(raw.category).trim() : "";

  // Required fields validation
  if (!title || isNaN(price) || !description || !categoryName) return null;

  // Ensure category exists
  let category = await Category.findOne({ name: categoryName });
  if (!category) category = await Category.create({ name: categoryName });

  const brand = raw.brand ? String(raw.brand).trim() : "";
  const stock = raw.stock ? Number(raw.stock) : 0;
  const discountPrice = raw.discountPrice ? Number(raw.discountPrice) : 0;

  // Sizes parsing (string | array)
  let sizes = [];
  if (Array.isArray(raw.sizes)) {
    sizes = raw.sizes.map(String).map((s) => s.trim());
  } else if (typeof raw.sizes === "string") {
    sizes = raw.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Measurement logic
  const measurementType = ["SIZE", "WEIGHT", "VOLUME"].includes(
    raw.measurementType
  )
    ? raw.measurementType
    : "SIZE";

  let measurementOptions = [];
  if (measurementType !== "SIZE") {
    if (Array.isArray(raw.measurementOptions)) {
      measurementOptions = raw.measurementOptions;
    } else if (typeof raw.measurementOptions === "string") {
      try {
        measurementOptions = JSON.parse(raw.measurementOptions);
      } catch {
        measurementOptions = [];
      }
    }
  }
  // 🔒 IMAGE IS REQUIRED (import must follow same rules as manual add)
  if (!isValidUrl(raw.image)) {
    return null; // ❌ skip this product
  }

  return {
    title,
    price,
    description,
    category: category.name,
    image: raw.image,
    brand,
    stock,
    discountPrice,
    measurementType,
    measurementOptions,
    sizes,
  };
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};
//CREATE PRODUCT (manual admin add)

export const createProduct = async (req, res) => {
  console.log("CREATE PRODUCT HIT");
  try {
    const {
      title,
      price,
      discountPrice,
      description,
      category,
      brand,
      stock,
      measurementType,
      measurementOptions,
      sizes,
      // rate,
      // count,
    } = req.body;

    if (!title || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, description, and category are required",
      });
    }
    // ✅ VALIDATE measurementOptions for WEIGHT / VOLUME
    if (
      (measurementType === "WEIGHT" || measurementType === "VOLUME") &&
      (!measurementOptions ||
        (() => {
          try {
            return JSON.parse(measurementOptions).length === 0;
          } catch {
            return true;
          }
        })())
    ) {
      return res.status(400).json({
        success: false,
        message: "Measurement options required",
      });
    }

    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory)
      existingCategory = await Category.create({ name: category });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      title,
      price,
      description,
      category: existingCategory.name,
      image: imageUrl,
      brand: brand || "",
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: stock ? Number(stock) : 0,
      // ✅ ADDED
      measurementType,
      measurementOptions:
        measurementType === "SIZE"
          ? []
          : measurementOptions
          ? (() => {
              try {
                return JSON.parse(measurementOptions);
              } catch {
                return [];
              }
            })()
          : [],

      sizes: measurementType === "SIZE" && sizes ? JSON.parse(sizes) : [],
      // rating: {
      //   rate: rate ? Number(rate) : 0,
      //   count: count ? Number(count) : 0,
      // },
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};
export const importProductsJSON = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No JSON file uploaded" });
    }

    const raw = req.file.buffer.toString("utf-8");
    let array;
    try {
      array = JSON.parse(raw);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid JSON file" });
    }

    if (!Array.isArray(array) || array.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "JSON must be a non-empty array" });
    }

    const normalized = [];
    const errors = [];
    for (let i = 0; i < array.length; i++) {
      try {
        const item = array[i];
        const p = await normalizeProductObject(item);
        if (p) normalized.push(p);
        else
          errors.push({
            index: i,
            reason:
              "Missing required fields (title, price, description, category)",
          });
      } catch (e) {
        console.error("Error processing JSON item:", e);
        errors.push({ index: i, reason: e.message || "Unknown error" });
      }
    }

    if (normalized.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found in JSON file",
        errors,
      });
    }

    const created = await Product.insertMany(normalized, { ordered: false });

    return res.status(201).json({
      success: true,
      message: `${created.length} products imported successfully from JSON`,
      imported: created.length,
      total: array.length,
      skipped: array.length - created.length,
      errors,
    });
  } catch (error) {
    console.error("Import JSON Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error importing products (JSON)",
      error: error.message,
    });
  }
};

export const importProductsXLS = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No Excel file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res
        .status(400)
        .json({ success: false, message: "Excel file has no sheets" });
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!Array.isArray(rows) || rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Excel sheet contains no rows" });
    }

    const normalized = [];
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const p = await normalizeProductObject(row);
        if (p) normalized.push(p);
        else
          errors.push({
            row: i + 1,
            reason:
              "Missing required fields (title, price, description, category)",
          });
      } catch (e) {
        console.error("Error processing Excel row:", e);
        errors.push({ row: i + 1, reason: e.message || "Unknown error" });
      }
    }

    if (normalized.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found in Excel file",
        errors,
      });
    }

    const created = await Product.insertMany(normalized, { ordered: false });

    return res.status(201).json({
      success: true,
      message: `${created.length} products imported successfully from Excel`,
      imported: created.length,
      total: rows.length,
      skipped: rows.length - created.length,
      errors,
    });
  } catch (error) {
    console.error("Import XLS Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error importing products (Excel)",
      error: error.message,
    });
  }
};
