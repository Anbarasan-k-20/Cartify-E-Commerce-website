// frontend/src/pages/AddProduct.jsx
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const sizeOptions = ["S", "M", "L", "XL", "XXL"];

const WEIGHT_OPTIONS = [
  { value: 250, unit: "g", label: "250 g" },
  { value: 500, unit: "g", label: "500 g" },
  { value: 1, unit: "kg", label: "1 kg" },
  { value: 2, unit: "kg", label: "2 kg" },
  { value: 5, unit: "kg", label: "5 kg" },
];
const VOLUME_OPTIONS = [
  { value: 200, unit: "ml", label: "200 ml" },
  { value: 500, unit: "ml", label: "500 ml" },
  { value: 1, unit: "L", label: "1 L" },
  { value: 3, unit: "L", label: "3 L" },
  { value: 5, unit: "L", label: "5 L" },
];

const AddProduct = () => {
  const [values, setValues] = useState({
    title: "",
    price: "",
    discountPrice: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
    // rating: { rate: "", count: "" },
    image: null,
    measurementType: "",
    measurementOptions: [],
    sizes: [],
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [importFile, setImportFile] = useState(null);
  const [submitted, setSubmitted] = useState(false); // ✅ SIMPLE FLAG
  const navigate = useNavigate()
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
        name: newCategory.trim(),
      });

      if (res.data.success) {
        const created = res.data.data;

        setCategories((prev) => [...prev, created]);

        // 🔥 auto-select newly added category
        setValues((prev) => ({
          ...prev,
          category: created.name,
        }));

        setNewCategory("");
        alert("New category added successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding category");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setValues({ ...values, image: files[0] });
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
      console.log(err);
      alert("Import failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMeasurement = (option) => {
    setValues((prev) => {
      const exists = prev.measurementOptions.some(
        (o) => o.value === option.value && o.unit === option.unit
      );

      return {
        ...prev,
        measurementOptions: exists
          ? prev.measurementOptions.filter(
              (o) => !(o.value === option.value && o.unit === option.unit)
            )
          : [...prev.measurementOptions, option],
      };
    });
  };

  const toggleSize = (size) => {
    setValues((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // handleSubmit() ONLY (other UI code is already correct)

  const handleSubmit = async () => {
    setSubmitted(true); // ✅ trigger red fields
    if (
      !values.title ||
      !values.price ||
      !values.description ||
      !values.category ||
      !values.measurementType
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Validate measurement selection
    if (
      values.measurementType !== "SIZE" &&
      values.measurementOptions.length === 0
    ) {
      alert("Select at least one measurement option");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("measurementType", values.measurementType);

    if (values.brand) formData.append("brand", values.brand);
    if (values.stock !== "") formData.append("stock", values.stock);
    if (values.discountPrice)
      formData.append("discountPrice", values.discountPrice);

    // Only for WEIGHT / VOLUME
    if (values.measurementType !== "SIZE") {
      formData.append(
        "measurementOptions",
        JSON.stringify(values.measurementOptions)
      );
    }

    // Only for SIZE
    if (values.measurementType === "SIZE" && values.sizes.length) {
      formData.append("sizes", JSON.stringify(values.sizes));
    }

    if (!values.image) {
      alert("Product image is required");
      return;
    }

    formData.append("image", values.image);

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
          image: null,
          measurementType: "",
          measurementOptions: [],
          sizes: [],
        });
        setTimeout(() => setSuccess(false), 3000);
        navigate("/products")
      }
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container my-5 d-flex justify-content-center align-items-start"
      style={{ minHeight: "85vh" }}
    >
      <div
        className="shadow-lg border p-4 p-md-5 rounded-4 w-100"
        style={{ maxWidth: "800px", backgroundColor: "#fff" }}
      >
        {success && (
          <Alert severity="success">Product Added Successfully!</Alert>
        )}

        <h4 className="my-3 fw-bold d-flex align-items-center gap-2">
          <MdOutlineAddShoppingCart /> Add New Product
        </h4>

        <label className="form-label">Title *</label>
        <input
          className={`form-control mb-2 ${
            submitted && !values.title ? "is-invalid" : ""
          }`}
          name="title"
          value={values.title}
          onChange={handleChange}
        />

        <label className="form-label">Price *</label>
        <input
          className={`form-control mb-2 ${
            submitted && !values.title ? "is-invalid" : ""
          }`}
          type="number"
          name="price"
          value={values.price}
          onChange={handleChange}
        />

        <label className="form-label">Discount Price</label>
        <input
          className={`form-control mb-2 ${
            submitted && !values.title ? "is-invalid" : ""
          }`}
          type="number"
          name="discountPrice"
          value={values.discountPrice}
          onChange={handleChange}
        />

        <label className="form-label">Category *</label>
        <select
          className={`form-control mb-2 ${
            submitted && !values.title ? "is-invalid" : ""
          }`}
          name="category"
          value={values.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="form-label mt-2">Add New Category (optional)</label>
        <div className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={handleAddCategory}
          >
            Add
          </button>
        </div>

        <label className="form-label">Brand</label>
        <input
          className={`form-control mb-2 ${
            submitted && !values.category ? "is-invalid" : ""
          }`}
          name="brand"
          value={values.brand}
          onChange={handleChange}
        />

        <label className="form-label">Description *</label>
        <textarea
          className={`form-control mb-2 ${
            submitted && !values.category ? "is-invalid" : ""
          }`}
          rows="3"
          name="description"
          value={values.description}
          onChange={handleChange}
        />

        <label className="form-label">Stock</label>
        <input
          className={`form-control mb-2 ${
            submitted && !values.category ? "is-invalid" : ""
          }`}
          type="number"
          name="stock"
          value={values.stock}
          onChange={handleChange}
        />

        {/* ✅ ADDED */}
        <label className="form-label mt-3">Measurement Type *</label>
        <select
          className={`form-control mb-2 ${
            submitted && !values.category ? "is-invalid" : ""
          }`}
          value={values.measurementType}
          onChange={(e) =>
            setValues({
              ...values,
              measurementType: e.target.value,
              measurementOptions: [],
              sizes: [],
            })
          }
        >
          <option value="">Select</option>
          <option value="SIZE">Size</option>
          <option value="WEIGHT">Weight</option>
          <option value="VOLUME">Volume</option>
        </select>

        {/* SIZE */}
        {values.measurementType === "SIZE" && (
          <>
            <label className="form-label">Sizes</label>
            <div className="d-flex gap-2 flex-wrap mb-3">
              {sizeOptions.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`btn btn-sm ${
                    values.sizes.includes(sz) ? "btn-dark" : "btn-outline-dark"
                  }`}
                  onClick={() => toggleSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </>
        )}

        {/* WEIGHT / VOLUME */}
        {(values.measurementType === "WEIGHT" ||
          values.measurementType === "VOLUME") && (
          <>
            <label className="form-label">Measurement Options</label>
            <div className="d-flex gap-2 flex-wrap mb-3">
              {(values.measurementType === "WEIGHT"
                ? WEIGHT_OPTIONS
                : VOLUME_OPTIONS
              ).map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className={`btn btn-sm ${
                    values.measurementOptions.some(
                      (o) => o.value === opt.value && o.unit === opt.unit
                    )
                      ? "btn-dark"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => toggleMeasurement(opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        <label className="form-label">Product Image</label>
        <input
          className={`form-control mb-2 ${
            submitted && !values.category ? "is-invalid" : ""
          }`}
          type="file"
          name="image"
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="btn btn-dark"
          disabled={loading}
        >
          <IoMdAdd className="me-2" />
          {loading ? "Adding..." : "Add Product"}
        </button>

        <hr />

        <p>
          <strong>Import Collection of Products</strong>
        </p>
        <input
          type="file"
          className="form-control mb-3"
          onChange={handleImportFileChange}
        />
        <button
          className="btn btn-dark"
          onClick={handleImportSubmit}
          disabled={loading}
        >
          {loading ? "Importing..." : "Import Products"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
