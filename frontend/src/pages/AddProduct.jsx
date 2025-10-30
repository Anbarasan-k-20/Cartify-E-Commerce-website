import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import Alert from "@mui/material/Alert";

const AddProduct = () => {
  const [values, setValues] = useState({
    id: "",
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
  let handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "rate" || name === "count") {
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

  let handleSubmit = () => {
    if (
      !values.title ||
      !values.price ||
      !values.description ||
      !values.category
    ) {
      alert("Please Fill Fields");
      return;
    }
    setSuccess(true);
    console.log(values);
    setValues({
      id: "",
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
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center my-5"
        style={{ minHeight: "80vh" }}
      >
        {success && (
          <Alert severity="success" className="mb-3">
            Product Added Successfully!
          </Alert>
        )}
        <div
          className="d-flex flex-column w-100 px-3 shadow-lg py-5 px-4 rounded-4"
          style={{ maxWidth: "500px" }}
        >
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
            className="form-control"
          />
          <label className="form-label my-2">Price</label>
          <input
            type="number"
            onChange={handleChange}
            name="price"
            className="form-control"
          />
          <label className="form-label my-2">Category</label>
          <input
            type="text"
            onChange={handleChange}
            name="category"
            className="form-control"
          />
          <label className="form-label my-2">Description</label>
          <input
            type="text"
            onChange={handleChange}
            name="description"
            className="form-control"
          />
          <label className="form-label my-2">Ratings</label>
          <input
            type="number"
            onChange={handleChange}
            name="rate"
            className="form-control"
          />
          <label className="form-label my-2">Count</label>
          <input
            type="number"
            onChange={handleChange}
            name="count"
            className="form-control"
          />
          <label className="form-label my-2">Product Images </label>
          <input
            type="file"
            className="form-control"
            id="images"
            accept="image/*"
          />
          <div>
            <button onClick={handleSubmit} className="btn btn-dark my-4">
              <span>
                <IoMdAdd />
              </span>
              Add Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
