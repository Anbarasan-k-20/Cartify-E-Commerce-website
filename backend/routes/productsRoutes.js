// backend/routes/productRoutes.js
import express from "express";
import { upload } from "../middleware/uploadImage.js";
import {
  getAllProducts,
  createProduct,
  getProductById,
  importProductsJSON,
  importProductsXLS,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

// Single product creation (image upload supported)
router.post("/createProducts", upload.single("image"), createProduct);

// Bulk import routes (two separate endpoints as requested)
// - JSON import: POST /products/import-json  (file field name: file)
// - Excel import: POST /products/import-xls  (file field name: file)
router.post("/products/import-json", upload.single("file"), importProductsJSON);
router.post("/products/import-xls", upload.single("file"), importProductsXLS);

export default router;
