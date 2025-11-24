//productRoutes.js
import express from "express";
import { importProductsJSON } from "../controllers/productController.js";
import { upload } from "../middleware/uploadImage.js";
import {
  getAllProducts,
  createProduct,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);

router.get("/products/:id", getProductById);

router.post("/createProducts", upload.single("image"), createProduct);

export default router;
