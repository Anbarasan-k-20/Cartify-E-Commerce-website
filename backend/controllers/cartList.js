import cartSchema from "../models/cartModel.js";

export const getCartList = async (req, res) => {
  try {
    const carts = await cartSchema.find();
    res.status(200).json({ success: true, data: carts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Cart List",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const newCartItem = await cartSchema.create(req.body);
    res.status(201).json({ success: true, data: newCartItem });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    await cartSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Item removed" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting cart item",
      error: error.message,
    });
  }
};
