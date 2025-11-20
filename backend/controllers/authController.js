//D:\E Commerce Website\backend\controllers\authController.js
import User from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const { fullname, phone, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await User.create({ fullname, phone, email, password });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      success: true,
      message: "Login success",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
