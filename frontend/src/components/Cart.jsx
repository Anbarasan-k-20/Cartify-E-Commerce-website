// src/components/Cart.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import {
  fetchCart,
  removeFromCartDB,
  increaseQtyDB,
  decreaseQtyDB,
} from "../store/cartSliderReducer";

export default function Cart() {
  const dispatch = useDispatch();
  const {
    cart = [],
    loading,
    error,
  } = useSelector((state) => state.cart || {});
  const [showAlert, setShowAlert] = useState(false);
  const [busyId, setBusyId] = useState(null); // disables buttons per-item while request in-flight

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      setBusyId(id);
      await dispatch(removeFromCartDB(id)).unwrap();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (err) {
      console.error("Delete failed:", err);
      // optional: show user feedback
    } finally {
      setBusyId(null);
    }
  };

  const handleIncrease = async (id) => {
    try {
      setBusyId(id);
      await dispatch(increaseQtyDB(id)).unwrap();
    } catch (err) {
      console.error("Increase failed:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleDecrease = async (id) => {
    try {
      setBusyId(id);
      await dispatch(decreaseQtyDB(id)).unwrap();
    } catch (err) {
      console.error("Decrease failed:", err);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-danger text-center py-5">{error}</div>;
  }

  return (
    <div className="container my-5 bg-light p-3">
      {showAlert && (
        <Alert severity="success" className="mb-3">
          Cart item deleted successfully!
        </Alert>
      )}

      <h4 className="py-2 text-center text-md-start">Cart List</h4>

      {!cart || cart.length === 0 ? (
        <p className="text-center">No items in cart.</p>
      ) : (
        cart.map((item) => (
          <div
            className="row border-bottom py-3 align-items-center flex-column flex-md-row"
            key={item._id}
          >
            <div className="col-12 col-md-2 d-flex align-items-center justify-content-center mb-3 mb-md-0">
              <input type="checkbox" className="form-check-input me-2 mt-0" />
              <img
                src={item.image || "/placeholder.png"}
                alt={item.title}
                className="img-fluid"
                style={{
                  maxWidth: "100px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            <div className="col-12 col-md-5 text-center text-md-start">
              <h5 className="fw-semibold">{item.title}</h5>
              <p className="text-success mb-1">In stock</p>

              <div className="d-flex flex-wrap justify-content-center justify-content-md-start align-items-center gap-2">
                <div className="btn-group border rounded-pill">
                  <button
                    className="btn btn-sm"
                    onClick={() => handleDecrease(item._id)}
                    disabled={busyId === item._id}
                    aria-label={`decrease-${item._id}`}
                  >
                    -
                  </button>

                  <span className="px-3 py-1 fw-bold">
                    {item.quantity ?? 1}
                  </span>

                  <button
                    className="btn btn-sm"
                    onClick={() => handleIncrease(item._id)}
                    disabled={busyId === item._id || item.quantity >= 5}
                    aria-label={`increase-${item._id}`}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item._id)}
                  disabled={busyId === item._id}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="col-12 col-md-3 mb-3 mb-md-0 text-center text-md-start">
              <p className="text-muted small mb-0">
                {item.description || "No description available."}
              </p>
            </div>

            <div className="col-12 col-md-2 text-center text-md-end mt-3 mt-md-0">
              {/* show total price based on quantity */}
              <h5 className="fw-bold">
                {(
                  (item.discountPrice ?? item.price) * (item.quantity || 1)
                ).toFixed(2)}
              </h5>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
