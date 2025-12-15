import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Atom } from "react-loading-indicators";
import Button from "react-bootstrap/Button";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { GiShoppingCart } from "react-icons/gi";
import { IoBagCheckOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { addToCartDB } from "../store/cartSlice";

const API = import.meta.env.VITE_API_BASE_URL;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ added

  // console.log(id)
  useEffect(() => {
    axios
      .get(`${API}/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // ✅ redirect if not logged in
      return;
    }
    try {
      await dispatch(addToCartDB(product)).unwrap();
      setSuccessMessage(`${product.title} added to cart successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login"); // redirect if not logged in
      return;
    }
      navigate("/buyproduct", { state: { product } });
  };

  if (!product)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Atom color="#3d186aee" size="medium" text="Loading Product..." />
      </div>
    );
  return (
    <div className="container mt-4 product-detail-container">
      {successMessage && (
        <Alert className="mb-3" icon={<CheckIcon />} severity="success">
          {successMessage}
        </Alert>
      )}
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center">
          <div className="image-zoom-box">
            <img
              src={product.image}
              alt={product.title}
              className="detail-product-image"
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="product-title">{product.title}</h2>

          <div className="price-section">
            <strike className="text-muted old-price">₹{product.price}</strike>
            <h4 className="text-success new-price">₹{product.discountPrice}</h4>
            <p className="text-muted small">MRP (Inclusive of all taxes)</p>
          </div>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Ratings :</strong> ⭐{product.rating.rate}
          </p>
          <p>
            <strong>Product ID:</strong> {product._id}
          </p>

          {product.quantity < 10 && (
            <span className="badge bg-danger p-2 mb-2">
              Hurry! Only {product.quantity} left
            </span>
          )}

          <div className="d-flex gap-5">
            <Button
              onClick={handleBuyNow}
              variant="success"
              className="mt-2 btn-fixed"
            >
              <IoBagCheckOutline className="me-2" />
              Buy Now
            </Button>

            <Button
              onClick={handleAddToCart}
              variant="dark"
              className="mt-2 btn-fixed"
            >
              <GiShoppingCart className="me-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 text-center p-5">
          <h4>More Products You Like</h4>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
