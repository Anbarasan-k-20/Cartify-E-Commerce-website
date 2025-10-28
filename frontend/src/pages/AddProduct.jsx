import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
const AddProduct = () => {
  return (
    <>
      <div className="container">
        <div className="d-md-flex justify-content-center align-items-center px-3">
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
            <input type="text" id="title" className="form-control" />
            <label className="form-label my-2">Price</label>
            <input type="number" id="price" className="form-control" />
            <label className="form-label my-2">Category</label>
            <input type="text" id="category" className="form-control" />
            <label className="form-label my-2">Description</label>
            <input type="text" id="description" className="form-control" />
            <label className="form-label my-2">Ratings</label>
            <input type="number" id="ratings" className="form-control" />
            <label className="form-label my-2">Count</label>
            <input type="number" id="count" className="form-control" />
            <label className="form-label my-2">Product Images </label>
            <input
              type="file"
              className="form-control"
              id="images"
              accept="image/*"
            />
            <div>
              <button className="btn btn-dark my-4">
                <span>
                  <IoMdAdd />
                </span>
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
