import express from "express";
import multer from "multer";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Multer setup for handling file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/products", getAllProducts);
router.post("/createProducts", upload.single("image"), createProduct);

export default router;
