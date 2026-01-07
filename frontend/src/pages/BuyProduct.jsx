import { Button, Form, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../store/buyProductSlice"; // RTK slice

import { resetOrder } from "../store/buyProductSlice";

import { useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

import validator from "validator";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

const BuyProduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.buyProduct);
  const product = location.state?.product;
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "India",
    street: "",
    apartment: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (!product) {
      navigate("/products");
    }
  }, [product, navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        firstName: user.fullname?.split(" ")[0] || "",
        lastName: user.fullname?.split(" ")[1] || "",
        phone: user.phone || "",
      }));
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetOrder());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const deliveryFee = selectedDelivery === "standard" ? 40 : 59;
  const codFee = 7;
  const total = (product?.discountPrice || 0) + deliveryFee + codFee;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // PIN: only digits, max 6
    if (name === "pin") {
      if (!/^\d{0,6}$/.test(value)) return;
    }

    // PHONE: allow + and digits only
    if (name === "phone") {
      if (!/^\+?\d*$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (
      !formData.firstName ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.pin ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Please fill all required fields");
      return;
    }

    // PIN validation
    if (
      !validator.isLength(formData.pin, { min: 6, max: 6 }) ||
      !validator.isNumeric(formData.pin)
    ) {
      alert("PIN code must be exactly 6 digits");
      return;
    }

    // Phone validation (+country code required)
    const phoneWithPlus = `+${formData.phone}`;

    if (!validator.isMobilePhone(phoneWithPlus, "en-IN")) {
      alert("Enter a valid phone number with country code");
      return;
    }
    // Email validation
    if (!validator.isEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const orderData = {
      // User info
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      country: formData.country,
      street: formData.street,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      pin: formData.pin,
      phone: formData.phone,
      email: formData.email,
      // Product info
      productId: String(product._id), //productId: product._id?.toString(),
      productTitle: product.title,
      productPrice: product.discountPrice,
      productImage: product.image,
      category: product.category,
      // Order details
      deliveryType: selectedDelivery,
      deliveryFee,
      codFee,
      totalAmount: total,
    };
    try {
      await dispatch(placeOrder(orderData)).unwrap();
      // Reset form after successful order
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        country: "India",
        street: "",
        apartment: "",
        city: "",
        state: "",
        pin: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  if (!product) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {success && (
        <Alert severity="success" className="mb-3">
          Order placed successfully! Your order ID is saved.
        </Alert>
      )}
      {error && (
        <Alert severity="error" className="mb-3">
          {error}
        </Alert>
      )}

      <div className="row">
        <div className="col-md-7">
          <h4 className="mb-3">Billing Details</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name (Optinal)</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country / Region *</Form.Label>
              <Form.Select
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option>India</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street Address *</Form.Label>
              <Form.Control
                type="text"
                name="street"
                placeholder="House number and street name"
                value={formData.street}
                onChange={handleChange}
              />
              <Form.Control
                className="mt-2"
                type="text"
                name="apartment"
                placeholder="Apartment, suite, unit (optional)"
                value={formData.apartment}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Town / City *</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>State *</Form.Label>
              <Form.Select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option>Select an option...</option>
                <option>Tamil Nadu</option>
                <option>Kerala</option>
                <option>Karnataka</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>PIN Code *</Form.Label>
              <Form.Control
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <PhoneInput
                country={"in"}
                value={formData.phone}
                onChange={(phone) =>
                  setFormData((prev) => ({ ...prev, phone }))
                }
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                inputStyle={{
                  width: "100%",
                  height: "38px",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </div>

        <div className="col-md-5">
          <Card>
            <Card.Header>Your Order</Card.Header>
            <Card.Body>
              {/* Product Image */}
              <div className="mb-3 text-center">
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    maxWidth: "150px",
                    height: "150px",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Product Details */}
              <h6 className="fw-bold mb-2">{product.title}</h6>
              <p className="text-muted small mb-3">{product.description}</p>

              <hr />

              {/* Price Breakdown */}
              <div className="d-flex justify-content-between mb-2">
                <span>Product Price</span>
                <span>₹{product.discountPrice}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Delivery ({selectedDelivery})</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>COD Fee</span>
                <span>₹{codFee}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong>₹{total}</strong>
              </div>

              {/* Delivery Options */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Delivery Options:</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={selectedDelivery === "standard"}
                    onChange={(e) => setSelectedDelivery(e.target.value)}
                  />
                  <label className="form-check-label">
                    Standard (Friday, 5 Dec) - ₹40
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={selectedDelivery === "express"}
                    onChange={(e) => setSelectedDelivery(e.target.value)}
                  />
                  <label className="form-check-label">
                    Express (Thursday, 4 Dec) - ₹59
                  </label>
                </div>
              </div>

              <Button
                variant="success"
                className="w-100 mt-3"
                onClick={handlePlaceOrder}
              >
                {loading ? "Placing Order..." : "PLACE ORDER"}
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyProduct;
