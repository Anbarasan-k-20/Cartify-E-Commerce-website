//D:\E Commerce Website\frontend\src\pages\Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import axios from "axios";

import axiosInstance from "../axiosInstance";

// const API = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  let navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fields.email || !fields.password) {
      alert("Please Fill All The Fields");
      return;
    }

    try {
      const res = await axiosInstance.post(`/auth/login`, {
        email: fields.email,
        password: fields.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setAlertMsg(true);
      setErrorMsg("");

      setFields({ email: "", password: "" });

      setTimeout(() => {
        setAlertMsg(false);
        navigate("/");
      }, 1500);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "350px", width: "100%" }}
      >
        {alertMsg && <Alert severity="success">Login Successful</Alert>}
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <div className="d-flex flex-column shadow-lg py-5 px-4 rounded-4">
          <h4>Login Form</h4>

          <label className="my-2">Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            onChange={handleChange}
            value={fields.email}
          />

          <label className="my-2">Password</label>
          <div className="position-relative">
            <input
              className="form-control"
              type={showPassword ? "text" : "password"}
              name="password"
              value={fields.password}
              onChange={handleChange}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button className="btn btn-dark mt-3" type="submit">
            Login
          </button>

          <a
            className="text-center mt-3"
            style={{ fontSize: "12px", cursor: "pointer" }}
            onClick={() => navigate("/createaccount")}
          >
            Don't Have An Account?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
