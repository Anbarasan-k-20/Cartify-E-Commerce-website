//D:\E Commerce Website\backend\db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);//
    console.log(`MongoDB Connected: ${connect.connection.host}`); //console statement
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); //exit
  }
};
