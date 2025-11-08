import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/productsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoute from "./routes/cartRoute.js";
import { connectDB } from "./db.js";

// import errorHandling from "./middleware/errorHandling.js";

const app = express();

dotenv.config();

// Middleware

app.use(cors());
app.use(express.json());

// Connect to Database

connectDB();

// Routes

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

//  app.use(errorHandling);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
