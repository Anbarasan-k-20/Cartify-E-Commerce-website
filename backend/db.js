import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
  mongoose
    .connect(
      "mongodb+srv://anbarasankrishna52_db_user:anbu1234@myecom.zzfvjyn.mongodb.net/?appName=MyEcom"
    )
    .then((con) => {
      console.log(`Mongo DB Database connected With ${con.connection.host}`);
    });
};
