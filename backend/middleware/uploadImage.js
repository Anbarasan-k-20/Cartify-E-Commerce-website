// backend/middleware/uploadImage.js
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed =
      file.mimetype === "application/json" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype.startsWith("image/");

    if (allowed) cb(null, true);
    else
      cb(
        new Error(
          "Invalid file type. Only JSON, Excel (.xls/.xlsx) and image files are allowed."
        ),
        false
      );
  },
  limits: {
    // adjust to your needs
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * uploadToCloudinary(buffer)
 * Used only for single-product image upload (createProducts).
 * Bulk imports DO NOT call this — they store the image URL directly.
 */
export const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};
