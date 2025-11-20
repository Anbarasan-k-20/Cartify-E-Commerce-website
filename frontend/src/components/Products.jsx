// Product.jsx
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import useFetch from "./customHook/useFetch";
import { GiShoppingCart } from "react-icons/gi";
import { Atom } from "react-loading-indicators";
import { useDispatch } from "react-redux";
import { addToCartDB } from "../store/cartSliderReducer";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate, useLocation } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, isError } = useFetch(
    "http://localhost:3000/api/v1/products"
  );

  const [successMessage, setSuccessMessage] = useState("");

  const handleCart = async (product) => {
    try {
      // const result = await dispatch(addToCartDB(product)).unwrap();
      await dispatch(addToCartDB(product)).unwrap();
      setSuccessMessage(`${product.title} added to cart successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setSuccessMessage("");
    }
  };

  // GET SEARCH QUERY
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search")?.toLowerCase() || "";
  
  // FILTER products by search query
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery)
  );
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Atom color="#3d186aee" size="medium" text="Loading Products..." />
      </div>
    );
  }


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Products ({filteredProducts.length})</h2>

      {successMessage && (
        <div className="mb-3">
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            {successMessage}
          </Alert>
        </div>
      )}

      <div className="row">
        {filteredProducts.map((product, index) => (
          <div className="col-md-4 mb-4" key={index}>
            {/* PRODUCT CARD OPENS A NEW PAGE */}
            <Card
              className="h-100 shadow-sm text-center product-card"
              onClick={() => navigate(`/product/${product._id}`)} // <-- redirect
              style={{ cursor: "pointer" }}
            >
              <div className="product-card position-relative">
                {product.stock < 10 && (
                  <span
                    className="badge bg-danger px-2 py-1 position-absolute custom-badge"
                    style={{ top: "10px", left: "10px", zIndex: 1 }}
                  >
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              <Card.Img
                variant="top"
                src={product.image}
                alt={product.title}
                style={{ height: "300px", objectFit: "contain" }}
              />

              <Card.Body>
                <Card.Title>{product.title}</Card.Title>

                <div>
                  <Card.Text>
                    <span
                      style={{ textDecoration: "line-through", color: "#888" }}
                    >
                      MRP ₹{product.price}
                    </span>
                  </Card.Text>
                  <Card.Text className="mb-3">
                    <strong>₹Discount Price {product.discountPrice}</strong>
                  </Card.Text>
                </div>

                {/* Description clamps to 2 lines */}
                <Card.Text
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.description}
                </Card.Text>

                {/* ADD TO CART BUTTON */}
                <div className="d-flex justify-content-end">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCart(product);
                    }}
                    variant="dark"
                    className="d-flex gap-2 align-items-center"
                  >
                    <GiShoppingCart />
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}

        {isError && (
          <p className="text-danger text-center mt-5">
            Error loading products: {isError}
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
