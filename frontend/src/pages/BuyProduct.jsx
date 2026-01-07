import { Button, Form, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, resetOrder } from "../store/buyProductSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import validator from "validator";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import { Country, State } from "country-state-city";

const BuyProduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.buyProduct);
  const product = location.state?.product;

  // ✅ Countries & States from npm package (NO hardcoding)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "IN", // ✅ Default India (ISO code)
    state: "",
    street: "",
    apartment: "",
    city: "",
    pin: "",
    phone: "",
    email: "",
  });

  /* -----------------------------------
     Load all countries once
  ----------------------------------- */
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Redirect if no product
  useEffect(() => {
    if (!product) navigate("/products");
  }, [product, navigate]);

  /* -----------------------------------
     Load all countries once
  ----------------------------------- */
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  /* -----------------------------------
     Load states when country changes
  ----------------------------------- */
  useEffect(() => {
    if (formData.country) {
      const stateList = State.getStatesOfCountry(formData.country);
      setStates(stateList);

      // Reset state when country changes
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  }, [formData.country]);

  /* -----------------------------------
     Prefill logged-in user data
  ----------------------------------- */

  // Pre-fill user info
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

  // Reset order state after success
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

    if (name === "pin" && !/^\d{0,6}$/.test(value)) return;
    if (name === "phone" && !/^\+?\d*$/.test(value)) return;

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

    if (
      !validator.isLength(formData.pin, { min: 6, max: 6 }) ||
      !validator.isNumeric(formData.pin)
    ) {
      alert("PIN code must be exactly 6 digits");
      return;
    }

    const phoneWithPlus = `+${formData.phone}`;
    if (!validator.isMobilePhone(phoneWithPlus, "en-IN")) {
      alert("Enter a valid phone number with country code");
      return;
    }

    if (!validator.isEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const orderData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      country: formData.country, // ISO code
      street: formData.street,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      pin: formData.pin,
      phone: formData.phone,
      email: formData.email,

      productId: String(product._id),
      productTitle: product.title,
      productPrice: product.discountPrice,
      productImage: product.image,
      category: product.category,

      deliveryType: selectedDelivery,
      deliveryFee,
      codFee,
      totalAmount: total,
    };

    try {
      await dispatch(placeOrder(orderData)).unwrap();
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

  if (!product) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container mt-4">
      {success && (
        <Alert severity="success" className="mb-3">
          Order placed successfully!
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
              <Form.Label>Last Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>

            {/* COUNTRY DROPDOWN */}
            <Form.Group className="mb-3">
              <Form.Label>Country *</Form.Label>
              <Form.Select
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                {countries.map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* STATE DROPDOWN */}
            <Form.Group className="mb-3">
              <Form.Label>State *</Form.Label>
              <Form.Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!states.length}
              >
                <option value="">Select state</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street Address *</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="House number and street name"
              />
              <Form.Control
                type="text"
                className="mt-2"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="Apartment, suite, unit (optional)"
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
                country="in"
                value={formData.phone}
                onChange={(phone) =>
                  setFormData((prev) => ({ ...prev, phone }))
                }
                inputProps={{ name: "phone", required: true }}
                inputStyle={{ width: "100%", height: "38px" }}
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
              <h6 className="fw-bold mb-2">{product.title}</h6>
              <p className="text-muted small mb-3">{product.description}</p>
              <hr />
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
                  <label className="form-check-label">Standard - ₹40</label>
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
                  <label className="form-check-label">Express - ₹59</label>
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
