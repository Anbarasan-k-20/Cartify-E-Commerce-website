//D:\E Commerce Website\backend\routes\categoryRoutes.js

import express from "express";
import {
  getAllCategories,
  createCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);

export default router;
