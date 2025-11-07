import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import axios from "axios";

const AddProduct = () => {
  const [values, setValues] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    rating: { rate: "", count: "" },
    image: null,
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/categories");
      if (res.data.success) setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Enter a category name");
    try {
      const res = await axios.post("http://localhost:3000/api/v1/categories", {
        name: newCategory,
      });
      if (res.data.success) {
        setCategories((prev) => [...prev, res.data.data]);
        setNewCategory("");
        alert("New category added successfully!");
      }
    } catch (error) {
      alert("Error adding category: " + error.message);
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

  const handleSubmit = async () => {
    if (
      !values.title ||
      !values.price ||
      !values.description ||
      !values.category
    ) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("rate", values.rating.rate);
    formData.append("count", values.rating.count);
    if (values.image) formData.append("image", values.image);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/createProducts",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setSuccess(true);
        setValues({
          title: "",
          price: "",
          description: "",
          category: "",
          rating: { rate: "", count: "" },
          image: null,
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
      className="container d-flex justify-content-center align-items-center my-5"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="d-flex flex-column w-100 px-3 shadow-lg py-5 rounded-4"
        style={{ maxWidth: "500px" }}
      >
        {success && (
          <Alert severity="success" className="mb-3">
            Product Added Successfully!
          </Alert>
        )}
        <h4 className="my-3">
          <MdOutlineAddShoppingCart className="me-2" /> Add Products
        </h4>

        <label className="form-label my-2">Title</label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="form-control"
        />

        <label className="form-label my-2">Price</label>
        <input
          type="number"
          name="price"
          value={values.price}
          onChange={handleChange}
          className="form-control"
        />

        <label className="form-label my-2">Category</label>
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

        <label className="form-label my-2">
          Create New Category (Optional)
        </label>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="form-control"
          placeholder="Add new category..."
        />
        <div>
          <button
            type="button"
            className="btn btn-outline-dark mt-2"
            onClick={handleAddCategory}
          >
            Add
          </button>
        </div>

        <label className="form-label my-2">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          className="form-control"
          rows="3"
        />

        <label className="form-label my-2">Rating (0-5)</label>
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

        <label className="form-label my-2">Count</label>
        <input
          type="number"
          name="count"
          value={values.rating.count}
          onChange={handleChange}
          className="form-control"
          min="0"
        />

        <label className="form-label my-2">Product Image</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="form-control"
        />
        <div>
          <button
            onClick={handleSubmit}
            className="btn btn-dark my-4"
            disabled={loading}
          >
            <IoMdAdd className="me-2" />
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
