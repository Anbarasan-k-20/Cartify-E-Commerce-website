import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import Alert from "@mui/material/Alert";

const AddProduct = () => {
  const [values, setValues] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    rating: {
      rate: "",
      count: "",
    },
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  let handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "rate" || name === "count") {
      // Allow empty value while typing (so user can delete/backspace)
      if (value === "") {
        setValues((prev) => ({
          ...prev,
          rating: {
            ...prev.rating,
            [name]: value,
          },
        }));
        return;
      }

      const numValue = Number(value);

      if (name === "rate") {
        // Allow 1–5 (including decimals)
        if (numValue < 1 || numValue > 5) return;
      }

      if (name === "count") {
        // Allow only positive integers
        if (!Number.isInteger(numValue) || numValue < 0) return;
      }

      setValues((prev) => ({
        ...prev,
        rating: {
          ...prev.rating,
          [name]: value,
        },
      }));
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  let handleSubmit = async () => {
    if (
      !values.title ||
      !values.price ||
      !values.description ||
      !values.category
    ) {
      alert("Please Fill All Fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/createProducts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setSuccess(true);
        setValues({
          title: "",
          price: "",
          description: "",
          category: "",
          rating: {
            rate: "",
            count: "",
          },
        });
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        alert("Error adding product: " + data.message);
      }
    } catch (error) {
      alert("Error adding product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center my-5"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="d-flex flex-column w-100 px-3 shadow-lg py-5 px-4 rounded-4"
          style={{ maxWidth: "500px" }}
        >
          {success && (
            <Alert severity="success" className="mb-3">
              Product Added Successfully!
            </Alert>
          )}
          <h4 className="my-3">
            <span className="me-1">
              <MdOutlineAddShoppingCart />
            </span>
            Add Products
          </h4>
          <label className="form-label my-2">Title</label>
          <input
            type="text"
            onChange={handleChange}
            name="title"
            value={values.title}
            className="form-control"
          />
          <label className="form-label my-2">Price</label>
          <input
            type="number"
            onChange={handleChange}
            name="price"
            value={values.price}
            className="form-control"
          />
          <label className="form-label my-2">Category</label>
          <select
            onChange={handleChange}
            name="category"
            value={values.category}
            className="form-control"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothes">Clothes</option>
            <option value="Books">Books</option>
            <option value="Furniture">Furniture</option>
            <option value="Home Appliances">Home Appliances</option>
          </select>
          <label className="form-label my-2">Description</label>
          <textarea
            onChange={handleChange}
            name="description"
            value={values.description}
            className="form-control"
            rows="3"
          />
          <label className="form-label my-2">Rating (0-5)</label>
          <input
            type="number"
            onChange={handleChange}
            name="rate"
            value={values.rating.rate}
            className="form-control"
            min="0"
            max="5"
            step="0.1"
          />
          <label className="form-label my-2">Count</label>
          <input
            type="number"
            onChange={handleChange}
            name="count"
            value={values.rating.count}
            className="form-control"
            min="0"
          />
          <div>
            <button
              onClick={handleSubmit}
              className="btn btn-dark my-4"
              disabled={loading}
            >
              <span>
                <IoMdAdd />
              </span>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
