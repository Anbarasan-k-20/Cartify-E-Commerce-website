import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import Button from "react-bootstrap/Button";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { GiShoppingCart } from "react-icons/gi";
import { IoBagCheckOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { addToCartDB } from "../store/cartSlice";

import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

import axiosInstance from "../axiosInstance";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [canReview, setCanReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);

  useEffect(() => {
    // Fetch product
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(console.error);

    // Fetch reviews
    axiosInstance
      .get(`/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch(console.error);

    // Review eligibility check
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (!token) {
      setCanReview(false);
      setCheckingReview(false);
      return;
    }

    axiosInstance
      .get(`/reviews/can-review/${id}`)
      .then((res) => {
        setCanReview(res.data.canReview);
        setCheckingReview(false);
      })
      .catch(() => {
        setCanReview(false);
        setCheckingReview(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await dispatch(addToCartDB(product)).unwrap();
      setSuccessMessage(`${product.title} added to cart successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    navigate("/buyproduct", { state: { product } });
  };

  const handleSubmitReview = async () => {
    // 🔐 Not logged in → redirect
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // ❌ Logged in but not eligible
    if (!canReview) {
      alert("You are not eligible to review this product");
      return;
    }

    // ❌ Validation
    if (!rating || !reviewText.trim()) {
      alert("Rating and review are required");
      return;
    }

    try {
      await axiosInstance.post("/reviews", {
        productId: id,
        rating,
        comment: reviewText,
      });

      alert("Review submitted successfully ✅");

      setRating(0);
      setReviewText("");
      setCanReview(false);

      const res = await axiosInstance.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Atom color="#3d186aee" size="medium" text="Loading Product..." />
      </div>
    );
  }

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
            <strong>Ratings :</strong> ⭐{product.rating?.rate}
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

      <hr />
      <h5 className="mt-4">Customer Reviews</h5>

      {reviews.length === 0 && <Alert severity="info">No reviews yet</Alert>}

      {reviews.map((r) => (
        <div key={r._id} className="border p-3 mb-3 rounded">
          <strong>{r.user?.fullname}</strong>
          <span className="badge bg-success ms-2">Verified Buyer</span>

          <Rating value={r.rating} readOnly />

          <p className="mb-1">{r.comment}</p>

          <small className="text-muted">
            {new Date(r.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}

      {/* Reviews Section */}
      <div className="row mt-5">
        <div className="col-md-8 mx-auto">
          <h4 className="mb-3">Write a Review</h4>

          {/* 🔄 Loading */}
          {checkingReview && (
            <Alert severity="info">Checking review eligibility...</Alert>
          )}

          {/* ❌ Not logged in */}
          {!checkingReview && !isLoggedIn && (
            <Alert severity="info">
              Please{" "}
              <span
                style={{ cursor: "pointer", color: "#1976d2" }}
                onClick={() => navigate("/login")}
              >
                login
              </span>{" "}
              to write a review.
            </Alert>
          )}

          {/* ❌ Logged in but not eligible */}
          {!checkingReview && isLoggedIn && !canReview && (
            <Alert severity="warning">
              You can only review products you have purchased.
            </Alert>
          )}

          {/* ✅ Eligible */}
          {!checkingReview && isLoggedIn && canReview && (
            <>
              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <Box sx={{ "& > legend": { mt: 2 } }}>
                <Typography component="legend">Your Rating</Typography>
                <Rating
                  name="product-rating"
                  value={rating}
                  onChange={(e, val) => setRating(val)}
                />
              </Box>

              {/* <Button
                variant="primary"
                className="mt-3"
                onClick={handleSubmitReview}
              >
                Submit Review
              </Button> */}
              <Button
                variant="primary"
                className="mt-3"
                disabled={!rating || !reviewText.trim()}
                onClick={handleSubmitReview}
              >
                Submit Review
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
