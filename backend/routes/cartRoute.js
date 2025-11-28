//cartRoute.js
import express from "express";
import {
  getCartList,
  addToCart,
  deleteCartItem,
  increaseQty,
  decreaseQty,
} from "../controllers/cartList.js";

const router = express.Router();

router.get("/", getCartList);
router.post("/", addToCart);
router.delete("/:id", deleteCartItem);

// for cart count + and  -

router.patch("/increase/:id", increaseQty);
router.patch("/decrease/:id", decreaseQty);

export default router;
