// const express = require("express");   // i ve changed the type ="module"

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/productsRoutes.js";
import { connectDB } from "./db.js";

const app = express();

dotenv.config();

// To Connect DB

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.use("/api/v1", router);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
