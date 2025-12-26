import Order from "../models/placeOrderModel.js";
import Product from "../models/Product.js";
export const placeOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login to place an order",
      });
    }
    const {
      productId,
      productTitle,
      productPrice,
      productImage,
      category,
      firstName,
      lastName,
      company,
      country,
      street,
      apartment,
      city,
      state,
      pin,
      phone,
      email,
      deliveryType,
      deliveryFee,
      codFee,
      totalAmount,
    } = req.body;

    if (
      !productId ||
      !productTitle ||
      productPrice == null ||
      !productImage ||
      !category ||
      !firstName ||
      !lastName ||
      !street ||
      !city ||
      !state ||
      !pin ||
      !phone ||
      !email ||
      deliveryFee == null ||
      codFee == null ||
      totalAmount == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    if (!/^[0-9]{6}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: "PIN code must be 6 digits",
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      productId,
      productTitle,
      productPrice,
      productImage,
      category,
      firstName,
      lastName,
      company,
      country,
      street,
      apartment,
      city,
      state,
      pin,
      phone,
      email,
      deliveryType,
      deliveryFee,
      codFee,
      totalAmount,
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};