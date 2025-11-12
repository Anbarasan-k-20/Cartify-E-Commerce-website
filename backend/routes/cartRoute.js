import express from "express";
import {
  getCartList,
  addToCart,
  deleteCartItem,
} from "../controllers/cartList.js";

const router = express.Router();

router.get("/", getCartList);
router.post("/", addToCart);
router.delete("/:id", deleteCartItem);

export default router;
