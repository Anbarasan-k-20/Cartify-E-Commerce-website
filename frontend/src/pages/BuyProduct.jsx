//D:\E Commerce Website\frontend\src\pages\BuyProduct.jsx
import { Button, Form, Card } from "react-bootstrap";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, resetOrder } from "../store/buyProductSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import validator from "validator";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
// for alert MUI

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axiosInstance from "../axiosInstance";

import { Country, State, City } from "country-state-city";

const BuyProduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.buyProduct);

  const product = location.state?.product;

  // ✅ Countries & States from npm package (NO hardcoding)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    street: false,
    city: false,
    state: false,
    pin: false,
    phone: false,
    email: false,
  });
  const [errors, setErrors] = useState({
    firstName: false,
    street: false,
    city: false,
    state: false,
    pin: false,
    phone: false,
    email: false,
  });

const INDIA_MOBILE_REGEX = useMemo(() => /^[6-9]\d{9}$/, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "IN", // ✅ India default
    state: "",
    street: "",
    apartment: "",
    city: "",
    pin: "",
    phone: "91", // ✅ India dial code default
    email: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const selectedMeasurement = location.state?.selectedMeasurement;
  const measurementType = product?.measurementType;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        const user = res.data.user;

        let phone = user?.phone || "91";

        // ensure phone starts with India dial code
        if (!phone.startsWith("91")) {
          phone = "91" + phone;
        }

        setFormData((prev) => ({
          ...prev,
          email: user?.email || "",
          phone,
          firstName: user?.fullname?.split(" ")[0] || "",
          lastName: user?.fullname?.split(" ")[1] || "",
          country: "IN", // 🔒 force India
        }));
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("🧾 BUY PRODUCT PAGE DATA:", {
      product,
      selectedMeasurement,
    });
  }, [product, selectedMeasurement]);

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
      setCities([]);

      setFormData((prev) => ({
        ...prev,
        state: "",
        city: "",
      }));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.country && formData.state) {
      const stateObj = states.find((s) => s.name === formData.state);

      if (stateObj) {
        const cityList = City.getCitiesOfState(
          formData.country,
          stateObj.isoCode
        );

        setCities(cityList || []);
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    }
  }, [formData.state, states, formData.country]);

  // Memoize validation function with all dependencies
  const validateAllFields = useCallback(() => {
    const rawPhone = formData.phone.replace(/^91/, "");
    
    const newErrors = {
      firstName: formData.firstName.trim() === '',
      street: formData.street.trim() === '',
      city: formData.city.trim() === '',
      state: formData.state.trim() === '',
      pin: !validator.isLength(formData.pin, { min: 6, max: 6 }) || 
           !validator.isNumeric(formData.pin),
      phone: !INDIA_MOBILE_REGEX.test(rawPhone),
      email: !validator.isEmail(formData.email),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }, [formData, INDIA_MOBILE_REGEX]);

  // Validate fields when form is submitted
  useEffect(() => {
    if (formSubmitted) {
      validateAllFields();
    }
  }, [formData, formSubmitted, validateAllFields]); // Added validateAllFields dependency

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
  const total = (product?.discountPrice || 0) + deliveryFee;

  const validateField = (fieldName) => {
    let isValid = true;
    const value = formData[fieldName];

    switch (fieldName) {
      case 'firstName':
        isValid = value.trim() !== '';
        break;
      case 'street':
        isValid = value.trim() !== '';
        break;
      case 'city':
        isValid = value.trim() !== '';
        break;
      case 'state':
        isValid = value.trim() !== '';
        break;
      case 'pin':
        isValid = validator.isLength(value, { min: 6, max: 6 }) && 
                 validator.isNumeric(value);
        break;
      case 'phone': {
        const rawPhone = value.replace(/^91/, '');
        isValid = INDIA_MOBILE_REGEX.test(rawPhone);
        break;
      }
      case 'email':
        isValid = validator.isEmail(value);
        break;
      default:
        isValid = true;
    }

    setErrors(prev => ({ ...prev, [fieldName]: !isValid }));
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pin" && !/^\d{0,6}$/.test(value)) return;
    if (name === "phone" && !/^\+?\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName);
  };

  const getFieldErrorClass = (fieldName) => {
    if ((touched[fieldName] || formSubmitted) && errors[fieldName]) {
      return "is-invalid";
    }
    return "";
  };

  const handlePlaceOrder = async () => {
    setFormSubmitted(true);

    // Mark all required fields as touched
    const requiredFields = ['firstName', 'street', 'city', 'state', 'pin', 'phone', 'email'];
    const touchedAll = {};
    requiredFields.forEach(field => {
      touchedAll[field] = true;
    });
    setTouched(prev => ({ ...prev, ...touchedAll }));

    // Validate all fields
    const isValid = validateAllFields();
    
    if (!isValid) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(field => errors[field]);
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!selectedMeasurement) {
      alert("Measurement not selected");
      return;
    }

    /* ---------- MEASUREMENT (FROM PRODUCT DETAIL PAGE) ---------- */
    let measurementPayload = null;

    if (measurementType === "SIZE") {
      measurementPayload = {
        type: "SIZE",
        value: selectedMeasurement, // "S", "M", "L"
        unit: null,
      };
    } else {
      measurementPayload = {
        type: measurementType, // WEIGHT / VOLUME
        value: selectedMeasurement.value,
        unit: selectedMeasurement.unit,
      };
    }

    const rawPhone = formData.phone.replace(/^91/, "");
    const phoneE164 = `+91${rawPhone}`;

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
      phone: phoneE164,
      email: formData.email,

      productId: String(product._id),
      productTitle: product.title,
      productPrice: product.discountPrice || product.price,
      productImage: product.image,
      category: product.category,

      // ✅ measurement
      measurement: measurementPayload,

      deliveryType: selectedDelivery,
      deliveryFee,
      totalAmount: total,
    };

    try {
      console.log("🧾 FINAL ORDER PAYLOAD:", orderData); // dev purpose
      await dispatch(placeOrder(orderData)).unwrap();
      
      // Reset form data and states
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        country: "IN",
        street: "",
        apartment: "",
        city: "",
        state: "",
        pin: "",
        phone: "",
        email: "",
      });
      setErrors({
        firstName: false,
        street: false,
        city: false,
        state: false,
        pin: false,
        phone: false,
        email: false,
      });
      setTouched({
        firstName: false,
        street: false,
        city: false,
        state: false,
        pin: false,
        phone: false,
        email: false,
      });
      setFormSubmitted(false);
      
      // ✅ Show confirmation popup
      setShowConfirmation(true);
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
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <DialogTitle>Order Placed!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your product has been purchased successfully. Do you want to keep
            shopping?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={() => navigate("/products")}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

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
                onBlur={() => handleBlur('firstName')}
                className={getFieldErrorClass('firstName')}
              />
              {(touched.firstName || formSubmitted) && errors.firstName && (
                <div className="text-danger mt-1">First name is required</div>
              )}
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
                onBlur={() => handleBlur('state')}
                className={getFieldErrorClass('state')}
                disabled={!states.length}
              >
                <option value="">Select state</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
              {(touched.state || formSubmitted) && errors.state && (
                <div className="text-danger mt-1">State is required</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street Address *</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                onBlur={() => handleBlur('street')}
                className={getFieldErrorClass('street')}
                placeholder="House number and street name"
              />
              {(touched.street || formSubmitted) && errors.street && (
                <div className="text-danger mt-1">Street address is required</div>
              )}
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
              <Form.Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={() => handleBlur('city')}
                className={getFieldErrorClass('city')}
                disabled={!cities.length}
              >
                <option value="">Select city</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
              {(touched.city || formSubmitted) && errors.city && (
                <div className="text-danger mt-1">City is required</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>PIN Code *</Form.Label>
              <Form.Control
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                onBlur={() => handleBlur('pin')}
                className={getFieldErrorClass('pin')}
              />
              {(touched.pin || formSubmitted) && errors.pin && (
                <div className="text-danger mt-1">PIN code must be exactly 6 digits</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <div className={getFieldErrorClass('phone')}>
                <PhoneInput
                  country="in"
                  value={formData.phone}
                  onChange={(value) => {
                    // value comes like "919876543210"
                    const raw = value.replace(/^91/, "");

                    // allow typing but block invalid start
                    if (raw.length === 1 && !/[6-9]/.test(raw)) return;

                    // allow max 10 digits
                    if (raw.length > 10) return;

                    setFormData((prev) => ({
                      ...prev,
                      phone: "91" + raw,
                    }));

                    // Clear error when user starts typing
                    if (errors.phone) {
                      setErrors(prev => ({ ...prev, phone: false }));
                    }
                  }}
                  onBlur={() => handleBlur('phone')}
                  inputProps={{
                    required: true,
                  }}
                  inputStyle={{ 
                    width: "100%", 
                    height: "38px",
                    borderColor: (touched.phone || formSubmitted) && errors.phone ? '#dc3545' : '#ced4da'
                  }}
                />
              </div>
              {(touched.phone || formSubmitted) && errors.phone && (
                <div className="text-danger mt-1">Enter a valid Indian mobile number starting with 6-9</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={getFieldErrorClass('email')}
              />
              {(touched.email || formSubmitted) && errors.email && (
                <div className="text-danger mt-1">Please enter a valid email address</div>
              )}
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

              {selectedMeasurement && (
                <p className="mb-2">
                  <strong>Selected Measurement:</strong>{" "}
                  {measurementType === "SIZE"
                    ? selectedMeasurement
                    : `${selectedMeasurement.value} ${selectedMeasurement.unit}`}
                </p>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span>Delivery ({selectedDelivery})</span>
                <span>₹{deliveryFee}</span>
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
                disabled={loading}
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