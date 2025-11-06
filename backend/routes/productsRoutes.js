import express from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.post("/createProducts", createProduct);

export default router;
