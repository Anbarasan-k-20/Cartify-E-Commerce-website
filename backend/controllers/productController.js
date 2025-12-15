// backend/controllers/productController.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { uploadToCloudinary } from "../middleware/uploadImage.js";
import XLSX from "xlsx";

/*
 * Helper: isValidUrl
 * Basic URL validation. It's permissive (http/https).
 */
const isValidUrl = (value) => {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * normalizeProductObject(raw)
 * - Accepts an object from JSON import or parsed Excel row.
 * - Ensures required fields exist: title, price, description, category.
 * - Coerces types and returns object matching Product schema.
 * - Returns null if required fields are missing / invalid.
 */

const normalizeProductObject = async (raw) => {
  if (!raw || typeof raw !== "object") return null;
  const title = raw.title ? String(raw.title).trim() : "";
  const price =
    raw.price !== undefined && raw.price !== null ? Number(raw.price) : NaN;
  const description = raw.description ? String(raw.description).trim() : "";
  const categoryName = raw.category ? String(raw.category).trim() : "";

  if (!title || Number.isNaN(price) || !description || !categoryName) {
    // Required fields missing — skip this record
    return null;
  }

  // image: accept URL string, otherwise empty string
  const image =
    raw.image && typeof raw.image === "string" ? raw.image.trim() : "";
  // brand, discountPrice, stock
  const brand = raw.brand ? String(raw.brand).trim() : "";
  const discountPrice =
    raw.discountPrice !== undefined && raw.discountPrice !== null
      ? Number(raw.discountPrice)
      : 0;
  const stock =
    raw.stock !== undefined && raw.stock !== null ? Number(raw.stock) : 0;

  // sizes: support JSON array or comma-separated string
  let sizes = [];
  if (Array.isArray(raw.sizes)) {
    sizes = raw.sizes.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof raw.sizes === "string" && raw.sizes.trim() !== "") {
    // Accept formats like "S,M,L" or '["S","M"]'
    const trimmed = raw.sizes.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      // try parse JSON array string
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed))
          sizes = parsed.map((s) => String(s).trim()).filter(Boolean);
      } catch {
        // fallback to comma split
        sizes = trimmed
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((s) => s.replace(/(^"|"$)/g, "").trim())
          .filter(Boolean);
      }
    } else {
      sizes = trimmed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  // rating fields
  const rate =
    raw.rate !== undefined && raw.rate !== null ? Number(raw.rate) : 0;
  const count =
    raw.count !== undefined && raw.count !== null ? Number(raw.count) : 0;

  // Ensure category exists or create
  let category = await Category.findOne({ name: categoryName });
  if (!category) {
    category = await Category.create({ name: categoryName });
  }

  return {
    title,
    price,
    description,
    category: category.name,
    image: image && isValidUrl(image) ? image : "", // store only valid URLs (otherwise empty)
    brand,
    discountPrice: isNaN(discountPrice) ? 0 : discountPrice,
    stock: isNaN(stock) ? 0 : stock,
    sizes,
    rating: {
      rate: isNaN(rate) ? 0 : rate,
      count: isNaN(count) ? 0 : count,
    },
  };
};

/* ----------------- Existing endpoints ----------------- */

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
    if (!existingCategory)
      existingCategory = await Category.create({ name: category });

    let imageUrl = "";
    if (req.file && req.file.buffer && req.file.mimetype.startsWith("image/")) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const product = await Product.create({
      title,
      price,
      description,
      category: existingCategory.name,
      image: imageUrl,
      brand: brand || "",
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: stock ? Number(stock) : 0,
      sizes: sizes ? JSON.parse(sizes) : [],
      rating: {
        rate: rate ? Number(rate) : 0,
        count: count ? Number(count) : 0,
      },
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

/* ----------------- Bulk Import Endpoints ----------------- */

/**
 * POST /products/import-json
 * Upload: single .json file (multipart/form-data key: file)
 * JSON file must contain an array of products (each product is an object).
 * Image field is expected to be a URL and will be stored directly.
 */
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

    // Insert and continue on errors (ordered: false)
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

/**
 * POST /products/import-xls
 * Upload: single Excel file (.xls or .xlsx) (multipart/form-data key: file)
 * The first sheet is used. Column headers must be:
 * title, price, description, category, image, brand, discountPrice, stock, sizes, rate, count
 * sizes may be "S,M,L" or a JSON array string '["S","M"]'
 */

export const importProductsXLS = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No Excel file uploaded" });
    }

    // Read workbook from buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res
        .status(400)
        .json({ success: false, message: "Excel file has no sheets" });
    }

    const sheet = workbook.Sheets[sheetName];
    // defval: "" ensures we do not get undefined for empty cells
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