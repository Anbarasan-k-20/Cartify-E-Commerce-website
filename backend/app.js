//D:\E Commerce Website\backend\app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/productsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoute from "./routes/cartRoute.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import reviewRoutes from "./routes/reviewRoutes.js";

import userRoutes from "./routes/userRoutes.js";

import { connectDB } from "./db.js";
const app = express();

dotenv.config();

// global Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Connect to DB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cartify API is running!",
    version: "1.0",
  });
});

app.use("/api/v1", router);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/users", userRoutes);

// for review
app.use("/api/v1/reviews", reviewRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
