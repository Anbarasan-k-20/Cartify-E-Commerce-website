// frontend/src/pages/AddProduct.jsx
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
// import axios from "axios";
import axiosInstance from "../axiosInstance";
// const API = import.meta.env.VITE_API_BASE_URL || "";

const sizeOptions = ["S", "M", "L", "XL", "XXL"];

const AddProduct = () => {
  const [values, setValues] = useState({
    title: "",
    price: "",
    discountPrice: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
    rating: { rate: "", count: "" },
    image: null,
    sizes: [],
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  // import file (JSON or Excel)
  const [importFile, setImportFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      if (res.data.success) setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Enter a category name");
    try {
      const res = await axiosInstance.post("/categories", {
        name: newCategory,
      });
      if (res.data.success) {
        setCategories((prev) => [...prev, res.data.data]);
        setNewCategory("");
        alert("New category added successfully!");
      }
    } catch (error) {
      alert("Error adding category");
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setValues({ ...values, image: files[0] });
    } else if (name === "rate" || name === "count") {
      setValues((prev) => ({
        ...prev,
        rating: { ...prev.rating, [name]: value },
      }));
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const handleImportFileChange = (e) => {
    setImportFile(e.target.files[0] || null);
  };

  const handleImportSubmit = async () => {
    if (!importFile) return alert("Choose a file");

    const lower = importFile.name.toLowerCase();
    let endpoint = "";

    if (lower.endsWith(".json")) endpoint = "/products/import-json";
    else if (lower.endsWith(".xls") || lower.endsWith(".xlsx"))
      endpoint = "/products/import-xls";
    else return alert("Unsupported file type");

    const formData = new FormData();
    formData.append("file", importFile);

    setLoading(true);
    try {
      const res = await axiosInstance.post(endpoint, formData);
      alert(res.data.message || "Import completed");
      setImportFile(null);
    } catch (err) {
      alert("Import failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (size) => {
    setValues((prev) => {
      const has = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: has
          ? prev.sizes.filter((s) => s !== size)
          : [...prev.sizes, size],
      };
    });
  };

  const handleSubmit = async () => {
    if (
      !values.title ||
      !values.price ||
      !values.description ||
      !values.category
    ) {
      alert(
        "Please fill all required fields (title, price, description, category)"
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price);
    if (values.discountPrice)
      formData.append("discountPrice", values.discountPrice);
    formData.append("description", values.description);
    formData.append("category", values.category);
    if (values.brand) formData.append("brand", values.brand);
    if (values.stock !== "") formData.append("stock", values.stock);
    formData.append("rate", values.rating.rate);
    formData.append("count", values.rating.count);

    if (values.sizes && values.sizes.length > 0)
      formData.append("sizes", JSON.stringify(values.sizes));
    if (values.image) formData.append("image", values.image);

    setLoading(true);
    try {
      const res = await axiosInstance.post("/createProducts", formData);

      if (res.data.success) {
        setSuccess(true);
        setValues({
          title: "",
          price: "",
          discountPrice: "",
          description: "",
          category: "",
          brand: "",
          stock: "",
          rating: { rate: "", count: "" },
          image: null,
          sizes: [],
        });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(res.data.message || "Error adding product");
      }
    } catch (error) {
      alert("Error adding product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-start my-5"
      style={{ minHeight: "85vh" }}
    >
      <div
        className="w-100 shadow-lg p-4 p-md-5 rounded-4"
        style={{ maxWidth: "900px", background: "#ffffff" }}
      >
        {success && (
          <Alert severity="success" className="mb-3">
            Product Added Successfully!
          </Alert>
        )}

        <h4 className="my-3 fw-bold d-flex align-items-center gap-2">
          <MdOutlineAddShoppingCart /> Add New Product
        </h4>

        {/* Title / Price / Discount */}
        <div className="row g-3 mt-2">
          <div className="col-12 col-md-6">
            <label className="form-label my-1">Title *</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label my-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={values.price}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label my-1">Discount Price (₹)</label>
            <input
              type="number"
              name="discountPrice"
              value={values.discountPrice}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Category / Brand */}
        <div className="row g-3 mt-3">
          <div className="col-12 col-md-6">
            <label className="form-label my-1">Category *</label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label my-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={values.brand}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* New Category */}
        <div className="mt-3">
          <label className="form-label my-1">
            Create New Category (Optional)
          </label>
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="form-control"
              placeholder="Add new category..."
              style={{ maxWidth: "300px" }}
            />
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={handleAddCategory}
            >
              Add
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-3">
          <label className="form-label my-1">Description *</label>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
          />
        </div>

        {/* Stock / Rating / Count / Image */}
        <div className="row g-3 mt-3">
          <div className="col-6 col-md-3">
            <label className="form-label my-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={values.stock}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label my-1">Rating (0-5)</label>
            <input
              type="number"
              name="rate"
              value={values.rating.rate}
              onChange={handleChange}
              className="form-control"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label my-1">Count</label>
            <input
              type="number"
              name="count"
              value={values.rating.count}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label my-1">Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="form-control"
            />
            <small className="text-muted"></small>
          </div>
        </div>

        {/* Sizes */}
        <div className="my-3">
          <label className="form-label fw-semibold">Sizes (optional)</label>
          <div className="d-flex gap-2 flex-wrap">
            {sizeOptions.map((sz) => (
              <button
                key={sz}
                type="button"
                className={
                  "btn btn-sm rounded-pill px-3 " +
                  (values.sizes.includes(sz)
                    ? "btn-dark text-white"
                    : "btn-outline-dark")
                }
                onClick={() => toggleSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Submit single product */}
        <div className="d-flex justify-content-end mt-4">
          <button
            onClick={handleSubmit}
            className="btn btn-dark px-4 py-2"
            disabled={loading}
          >
            <IoMdAdd className="me-2" />
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
        <hr />

        {/* Bulk Import */}
        <div>
          <p>
            <strong>Import Collection of Products(JSON / Excel)</strong>
          </p>
          <input
            id="import-file-input"
            type="file"
            accept=".json,.xls,.xlsx,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleImportFileChange}
            className="form-control my-3"
          />
          <div className="">
            {/* d-flex gap-2 align-items-center */}
            <button
              className="btn btn-dark"
              onClick={handleImportSubmit}
              disabled={loading}
            >
              {loading ? "Importing..." : "Import Products"}
            </button>
            <p className="text-muted my-2 text-wrap d-block">
              Excel columns:
              title,price,description,category,image,brand,discountPrice,stock,sizes,rate,count
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
