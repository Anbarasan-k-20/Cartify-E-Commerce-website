import cartSchema from "../models/cartModel.js";

export const getCartList = async (req, res) => {
  try {
    const carts = await cartSchema.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({ success: true, data: carts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Cart List",
      error: error.message,
    });
  }
};
// updated funtionality for cart adding with limitations
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const existing = await cartSchema.findOne({ productId });

    if (existing) {
      if (existing.quantity >= 5) {
        return res
          .status(400)
          .json({ success: false, message: "Max limit reached" });
      }

      existing.quantity += 1;
      await existing.save();

      return res.status(200).json({ success: true, data: existing });
    }

    // New item
    const newItem = await cartSchema.create(req.body);

    res.status(201).json({ success: true, data: newItem });
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

// cart manipulation by buton press in cart module

export const increaseQty = async (req, res) => {
  try {
    const item = await cartSchema.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.quantity >= 5) {
      return res.status(400).json({ message: "Max quantity reached" });
    }

    item.quantity += 1;
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ message: "Error updating qty" });
  }
};

export const decreaseQty = async (req, res) => {
  try {
    const item = await cartSchema.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.quantity <= 1) {
      return res.status(400).json({ message: "Min quantity is 1" });
    }

    item.quantity -= 1;
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ message: "Error updating qty" });
  }
};
