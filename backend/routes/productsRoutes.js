// import express from "express";
// import { upload } from "../middleware/uploadImage.js";
// import {
//   getAllProducts,
//   createProduct,
// } from "../controllers/productController.js";

// const router = express.Router();

// router.get("/products", getAllProducts);

// // use global upload middleware (memoryStorage already defined there)
// router.post("/createProducts", upload.single("image"), createProduct);

// export default router;

import express from "express";
import { upload } from "../middleware/uploadImage.js";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);

router.post("/createProducts", upload.single("image"), createProduct);

export default router;
