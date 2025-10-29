import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
const AddProduct = () => {
  const [values, setValues] = useState({
    id: "",
    title: "",
    price: 0,
    description: "",
    category: "",
    rating: {
      rate: 0,
      count: 0,
    },
  });
  let handleChange = (e) => {
    let { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  let handleSubmit = () => {
    console.log(values);
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="d-flex flex-column w-100 px-3 "
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
            name="ratings.rate"
            className="form-control"
          />
          <label className="form-label my-2">Count</label>
          <input
            type="number"
            onChange={handleChange}
            name="ratings.count"
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
