import Order from "../models/placeOrderModel.js"; // ✅ Make sure this exists
import Product from "../models/Product.js"; // ✅ Make sure this exists

// ...rest of code...
// ✅ Place Order
export const placeOrder = async (req, res) => {
  try {
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

    // ✅ Validate required fields
    if (
      !productId ||
      !productTitle ||
      !productPrice ||
      !firstName ||
      !lastName ||
      !street ||
      !city ||
      !state ||
      !pin ||
      !phone ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Validate PIN code (6 digits)
    if (!/^[0-9]{6}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: "PIN code must be 6 digits",
      });
    }

    // ✅ Validate Phone number (10 digits)
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    // ✅ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Create new order with user ID from token
    const order = await Order.create({
      userId: req.user._id, // ✅ From auth middleware
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

// ✅ Get all user orders
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

// ✅ Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Check if order belongs to user
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

// ✅ Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullname email phone")
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

// ✅ Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const { id } = req.params;

    if (!orderStatus && !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one status to update",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

// ✅ Cancel order (only pending orders)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Check if order belongs to user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ✅ Only pending orders can be cancelled
    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};
