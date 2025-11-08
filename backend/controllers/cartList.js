import cartSchema from "../models/cartModel.js";

export const getCartList = async (req, res) => {
  try {
    const carts = await cartSchema.find(); //.sort({ name: 1 })
    res.status(200).json({ success: true, data: carts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Cart List",
      error: error.message,
    });
  }
};
