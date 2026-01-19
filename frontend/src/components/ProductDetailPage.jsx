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

  // ✅ Measurement state
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);

  // for similar Products

  const [similarProducts, setSimilarProducts] = useState([]);

  /* ---------------- FETCH PRODUCT + REVIEWS ---------------- */
  useEffect(() => {
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(console.error);

    axiosInstance
      .get(`/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch(console.error);

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

  /* ---------------- DEFAULT MEASUREMENT ---------------- */

  useEffect(() => {
    if (!product) return;

    if (product.measurementType === "SIZE" && product.sizes?.length > 0) {
      setSelectedMeasurement(product.sizes[0]); // "S"
    }

    if (
      product.measurementType !== "SIZE" &&
      product.measurementOptions?.length > 0
    ) {
      setSelectedMeasurement(product.measurementOptions[0]); // {value, unit}
    }
  }, [product]);

  //for More Similar products
  // useEffect(() => {
  //   if (!product?.category) return;

  //   axiosInstance
  //     .get(`/products?category=${encodeURIComponent(product.category)}`)
  //     .then((res) => {
  //       const filtered = res.data.data.filter((p) => p._id !== product._id);
  //       setSimilarProducts(filtered);
  //     })
  //     .catch(console.error);
  // }, [product]);

  useEffect(() => {
    if (!product?.category) return;

    axiosInstance
      .get(`/products?category=${encodeURIComponent(product.category)}`)
      .then((res) => {
        const filtered = res.data.data.filter(
          (p) =>
            p.category === product.category && // 🔐 hard rule
            p._id !== product._id,
        );

        setSimilarProducts(filtered);
      })
      .catch(console.error);
  }, [product]);

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (!selectedMeasurement) {
      alert("Please select a measurement");
      return;
    }

    try {
      await dispatch(
        addToCartDB({
          ...product,
          selectedMeasurement,
        }),
      ).unwrap();
      console.log(product);

      setSuccessMessage(`${product.title} added to cart successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  /* ---------------- BUY NOW ---------------- */
  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (!selectedMeasurement) {
      alert("Please select a measurement");
      return;
    }
    console.log("Products ${product}  selectedMeasurement");

    navigate("/buyproduct", {
      state: {
        product,
        selectedMeasurement,
      },
    });
  };

  /* ---------------- SUBMIT REVIEW ---------------- */
  const handleSubmitReview = async () => {
    if (!isLoggedIn) return navigate("/login");
    if (!canReview) return alert("You are not eligible to review this product");
    if (!rating || !reviewText.trim())
      return alert("Rating and review are required");

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

  /* ---------------- LOADING ---------------- */
  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Atom color="#3d186aee" size="medium" text="Loading Product..." />
      </div>
    );
  }

  /* ====================== UI ====================== */
  return (
    <div className="container mt-4 product-detail-container">
      {successMessage && (
        <Alert className="mb-3" icon={<CheckIcon />} severity="success">
          {successMessage}
        </Alert>
      )}

      <div className="row">
        <div className="col-md-6 d-flex justify-content-center">
          <img
            src={product.image}
            alt={product.title}
            className="detail-product-image"
          />
        </div>

        <div className="col-md-6">
          <h2>{product.title}</h2>

          <strike className="text-muted">₹{product.price}</strike>
          <h4 className="text-success">₹{product.discountPrice}</h4>

          <p>{product.description}</p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>

          {product.measurementType === "SIZE" && product.sizes?.length > 0 && (
            <div className="mt-3">
              <strong>SIZE</strong>
              <div className="d-flex gap-2 mt-2">
                {product.sizes.map((sz) => (
                  <Button
                    key={sz}
                    size="sm"
                    variant={
                      selectedMeasurement === sz ? "dark" : "outline-secondary"
                    }
                    onClick={() => setSelectedMeasurement(sz)}
                  >
                    {sz}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.measurementType !== "SIZE" &&
            product.measurementOptions?.length > 0 && (
              <div className="mt-3">
                <strong>{product.measurementType}</strong>
                <div className="d-flex gap-2 mt-2">
                  {product.measurementOptions.map((m, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={
                        selectedMeasurement === m
                          ? "success"
                          : "outline-secondary"
                      }
                      onClick={() => setSelectedMeasurement(m)}
                    >
                      {`${m.value} ${m.unit}`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

          {/* ✅ STOCK FIX */}
          {product.stock < 10 && (
            <span className="badge bg-danger p-2 mt-2">
              Hurry! Only {product.stock} left
            </span>
          )}

          <div className="d-flex gap-4 mt-3">
            <Button variant="success" onClick={handleBuyNow}>
              <IoBagCheckOutline className="me-2" />
              Buy Now
            </Button>

            <Button variant="dark" onClick={handleAddToCart}>
              <GiShoppingCart className="me-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* More Similar Produucts */}

      <div className="my-4">
        <h4 className="mb-4 text-center">More Products You May Like</h4>
        {similarProducts.length > 0 && (
          <>
            <hr />
            <h5 className="mb-3">You might also like</h5>
            <div
              className="d-flex gap-3 overflow-hidden pb-3"
              style={{ whiteSpace: "nowrap" }}
            >
              {similarProducts.map((item) => (
                <div
                  key={item._id}
                  className="card"
                  style={{ minWidth: "320px", cursor: "pointer" }}
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h6 className="card-title text-truncate">{item.title}</h6>

                    <p className="mb-1 text-success fw-bold">
                      ₹{item.discountPrice}
                    </p>

                    <small className="text-muted">{item.category}</small>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <hr />

      {/* ================= REVIEWS ================= */}
      <h5 className="my-2">Customer Reviews</h5>

      {reviews.length === 0 && <Alert severity="info">No reviews yet</Alert>}

      {reviews.map((r) => (
        <div key={r._id} className="border p-3 mb-3 rounded">
          <strong>{r.user?.fullname}</strong>
          <Rating value={r.rating} readOnly />
          <p>{r.comment}</p>
        </div>
      ))}

      {/* WRITE REVIEW */}
      {!checkingReview && isLoggedIn && canReview && (
        <>
          <textarea
            className="form-control mb-3"
            rows="4"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <Box>
            <Typography>Your Rating</Typography>
            <Rating value={rating} onChange={(e, v) => setRating(v)} />
          </Box>

          <Button
            className="mt-3"
            disabled={!rating || !reviewText.trim()}
            onClick={handleSubmitReview}
          >
            Submit Review
          </Button>
        </>
      )}
    </div>
  );
};

export default ProductDetailPage;
