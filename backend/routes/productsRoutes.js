import express from "express";
import { upload } from "../middleware/uploadImage.js";
import {
  getAllProducts,
  createProduct,
  getProductById,
  importProductsJSON,
  importProductsXLS,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js"; // ✅ new middleware

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

// ✅ Only admin can create/import products
router.post(
  "/createProducts",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createProduct
);
router.post(
  "/products/import-json",
  protect,
  authorizeRoles("admin"),
  upload.single("file"),
  importProductsJSON
);
router.post(
  "/products/import-xls",
  protect,
  authorizeRoles("admin"),
  upload.single("file"),
  importProductsXLS
);

export default router;
