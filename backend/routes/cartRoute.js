import express from "express";
import { getCartList } from "../controllers/cartList.js";

const router = express.Router();

router.get("/", getCartList);

export default router;
