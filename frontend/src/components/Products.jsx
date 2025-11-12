import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import useFetch from "./customHook/useFetch";
import { GiShoppingCart } from "react-icons/gi";
import { FcLike } from "react-icons/fc";
import { Atom } from "react-loading-indicators";
import { useDispatch } from "react-redux";
import { addToCartDB } from "../store/cartSliderReducer";

// Material UI imports
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, isError } = useFetch(
    "http://localhost:3000/api/v1/products"
  );

  const [successMessage, setSuccessMessage] = useState("");

  const handleCart = async (product) => {
    try {
      await dispatch(addToCartDB(product)).unwrap();
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
        <Atom color="#6500dd" size="medium" text="Loading Products..." />
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
            <Card className="h-100 shadow-sm text-center product-card">
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
                <Card.Text>{product.description}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    onClick={() => handleCart(product)}
                    variant="dark"
                    className="d-flex gap-2 align-items-center"
                  >
                    <GiShoppingCart />
                    Add to Cart
                  </Button>
                  <Button variant="outline-danger">
                    <FcLike />
                    Whislist
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
