import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
// import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axiosInstance from "../axiosInstance";
// const API = import.meta.env.VITE_API_BASE_URL;

const CreateAccount = () => {
  const [alertMsg, setAlertMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [create, setCreate] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handlechange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") value = value.replace(/\D/g, "");
    if (name === "fullname") value = value.replace(/[^a-zA-Z ]/g, "");
    setCreate({ ...create, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(create).some((field) => !field)) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(create.phone)) {
      setErrorMsg("Phone number must be exactly 10 digits.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(create.email)) {
      setErrorMsg("Enter a valid email");
      return;
    }

    if (create.password !== create.confirmpassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setErrorMsg("");

    try {
      await axiosInstance.post(`/auth/register`, {
        fullname: create.fullname,
        phone: create.phone,
        email: create.email,
        password: create.password,
        role: create.role, //send role to backend
      });

      setAlertMsg(true);
      setCreate({
        fullname: "",
        phone: "",
        email: "",
        password: "",
        confirmpassword: "",
        role: "user",
      });

      setTimeout(() => {
        setAlertMsg(false);
        navigate("/login");
      }, 2500);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container">
      {alertMsg && (
        <Alert severity="success">Account Created Successfully!</Alert>
      )}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <div
        className="d-flex justify-content-center align-items-center my-5"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="shadow-lg p-4 rounded-4 w-100"
          style={{ maxWidth: "400px" }}
        >
          <form onSubmit={handleSubmit}>
            <h4>Create Account</h4>

            <label className="form-label mt-3">Full Name</label>
            <input
              className="form-control"
              name="fullname"
              value={create.fullname}
              onChange={handlechange}
            />

            <label className="form-label mt-3">Phone Number</label>
            <input
              className="form-control"
              name="phone"
              maxLength="10"
              value={create.phone}
              onChange={handlechange}
            />

            <label className="form-label mt-3">Email</label>
            <input
              className="form-control"
              name="email"
              value={create.email}
              onChange={handlechange}
              type="email"
            />

            <label className="form-label mt-3">Password</label>
            <div className="position-relative">
              <input
                className="form-control"
                type={showPass ? "text" : "password"}
                name="password"
                value={create.password}
                onChange={handlechange}
              />
              <span
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <label className="form-label mt-3">Confirm Password</label>
            <div className="position-relative">
              <input
                className="form-control"
                type={showConfirmPass ? "text" : "password"}
                name="confirmpassword"
                value={create.confirmpassword}
                onChange={handlechange}
              />
              <span
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showConfirmPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {/* Role Selection */}
            <label className="form-label mt-3">Account Type</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  value="user"
                  checked={create.role === "user"}
                  onChange={handlechange}
                />
                <label className="form-check-label">User</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  value="admin"
                  checked={create.role === "admin"}
                  onChange={handlechange}
                />
                <label className="form-check-label">Seller</label>
              </div>
            </div>

            <button className="btn btn-dark mt-4 w-100" type="submit">
              Create Account
            </button>

            <a
              className="text-center mt-3"
              style={{ fontSize: "12px", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Already Have an Account?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
