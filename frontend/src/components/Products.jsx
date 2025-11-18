// Product.jsx
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import useFetch from "./customHook/useFetch";
import { GiShoppingCart } from "react-icons/gi";
import { Atom } from "react-loading-indicators";
import { useDispatch } from "react-redux";
import { addToCartDB } from "../store/cartSliderReducer";
import ProductDetailModal from "../components/ProductDetailModal";

import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

const Products = () => {
  const dispatch = useDispatch();

  const { products, loading, isError } = useFetch(
    "http://localhost:3000/api/v1/products"
  );

  const [successMessage, setSuccessMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openProductModal = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // GLOBAL ADD TO CART FUNCTION
  const handleCart = async (product) => {
    console.log(product);

    try {
      await dispatch(addToCartDB(product)).unwrap();
      // await dispatch(addToCartDB(product._id));
      setSuccessMessage(`${product.title} added to cart successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setSuccessMessage("");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Atom color="#3d186aee" size="medium" text="Loading Products..." />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Products ({products?.length || 0})</h2>

      {successMessage && (
        <div className="mb-3">
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            {successMessage}
          </Alert>
        </div>
      )}

      <div className="row">
        {products?.map((product, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Card
              className="h-100 shadow-sm text-center product-card"
              onClick={() => openProductModal(product)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-card position-relative">
                {/* Badge appears in top-left */}
                {product.stock < 10 && (
                  <span
                    className="badge bg-danger px-2 py-1 position-absolute custom-badge"
                    style={{ top: "10px", left: "10px", zIndex: 1 }}
                  >
                    Only {product.stock} left!
                  </span>
                )}

                {/* Product content here */}
              </div>
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.title}
                style={{ height: "300px", objectFit: "contain" }}
              />

              <Card.Body>
                <Card.Title>{product.title}</Card.Title>

                <Card.Text>
                  <strong>₹{product.price}</strong>
                </Card.Text>

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

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={closeProductModal}
          // 🔧 FIX APPLIED: pass product into handler
          onAddToCart={(product) => handleCart(product)}
          onBuyNow={(product) => alert(`Buy Now clicked for: ${product.title}`)}
        />
      )}
    </div>
  );
};

export default Products;
