import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ✅ User Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ✅ Product Info
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    productImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },

    // ✅ Billing Address
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "India",
    },
    street: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    // ✅ Delivery & Payment
    deliveryType: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    codFee: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // ✅ Order Status
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
