import mongoose from "mongoose";

/*Measurement schema, Used only for WEIGHT / VOLUME products */
const measurementSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true }, // numeric value (e.g., 500, 1)
    unit: { type: String, required: true }, // g, kg, ml, L
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },

    description: { type: String, required: true },

    category: { type: String, required: true },

    // Image URL stored after Cloudinary upload
    image: { type: String, required: true },

    brand: { type: String, default: "" },

    // Discount is optional → default 0 (important fix)
    discountPrice: { type: Number, default: 0 },

    stock: { type: Number, required: true },

    /*   * Measurement Type
     *   SIZE → sizes array
     *   WEIGHT / VOLUME → measurementOptions array */
    measurementType: {
      type: String,
      enum: ["SIZE", "WEIGHT", "VOLUME"],
      required: true,
    },

    // Used only when measurementType !== SIZE
    measurementOptions: {
      type: [measurementSchema],
      default: [],
    },

    // Used only when measurementType === SIZE
    sizes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

/* Guard: prevent invalid data from entering DB, SIZE products must NOT have measurementOptions */
productSchema.pre("save", function (next) {
  if (this.measurementType === "SIZE") {
    this.measurementOptions = [];
  }
  next();
});

export default mongoose.model("Product", productSchema);
