//D:\E Commerce Website\backend\models\Product.js
import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: {
      type: String,
      required: true,
    },
    brand: { type: String, default: "" },
    discountPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sizes: {
      type: [String], // ["S", "M", "L"]
      default: [],
    },
    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
export default mongoose.model("Product", productSchema);