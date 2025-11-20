import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import axios from "axios";

const CreateAccount = () => {
  const [alertMsg, setAlertMsg] = useState(false);
  const [create, setCreate] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  let handlechange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      value = value.replace(/\D/g, ""); // accept only digits
    }

    if (name === "email") {
      value = value.trim(); // no spaces inside email
    }

    if (name === "fullname") {
      value = value.replace(/[^a-zA-Z ]/g, ""); // allow only letters & spaces
    }

    setCreate({
      ...create,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (
      !create.fullname ||
      !create.phone ||
      !create.email ||
      !create.password ||
      !create.confirmpassword
    ) {
      alert("Please fill all fields");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(create.email)) {
      alert("Enter a valid email address (e.g., user@mail.com)");
      return;
    }

    if (create.password !== create.confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          fullname: create.fullname,
          phone: create.phone,
          email: create.email,
          password: create.password,
        }
      );

      console.log("API RESPONSE:", res.data);
      setAlertMsg(true);

      setCreate({
        fullname: "",
        phone: "",
        email: "",
        password: "",
        confirmpassword: "",
      });

      setTimeout(() => setAlertMsg(false), 3000);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        {alertMsg && (
          <Alert severity="success" className="mb-3">
            Account Created Successfully!
          </Alert>
        )}
        <div
          className="d-flex justify-content-center align-items-center my-5"
          style={{ minHeight: "80vh" }}
        >
          <div
            className="d-flex flex-column w-100 px-3 shadow-lg py-5 px-4 rounded-4"
            style={{ maxWidth: "400px" }}
          >
            <form>
              <h4>Create Account</h4>
              <label className="form-label my-2">Full Name</label>
              <input
                className="form-control"
                value={create.fullname}
                name="fullname"
                onChange={handlechange}
                type="text"
              />
              <label className="form-label my-2">Phone Number</label>
              <input
                className="form-control"
                value={create.phone}
                name="phone"
                onChange={handlechange}
                type="tel"
                pattern="^[0-9]{10}$"
                inputMode="numeric"
                required
                maxLength={10}
              />
              <label className="form-label my-2">E-mail</label>
              <input
                className="form-control"
                value={create.email}
                name="email"
                onChange={handlechange}
                type="email"
                required
              />
              <label className="form-label my-2">Password</label>
              <input
                className="form-control"
                value={create.password}
                name="password"
                onChange={handlechange}
                type="text"
              />
              <label className="form-label my-2">Confirm Password</label>
              <input
                className="form-control"
                value={create.confirmpassword}
                name="confirmpassword"
                onChange={handlechange}
                type="text"
              />
              <div className="d-flex justify-content-end">
                <button
                  onClick={handleSubmit}
                  className="btn btn-dark mt-3"
                  onChange={handlechange}
                  type="submit"
                >
                  Create Account
                </button>
              </div>
            </form>
            <a
              style={{
                textAlign: "center",
                textDecoration: null,
                fontSize: "12px",
                marginTop: "20px",
              }}
              type="button"
              onClick={() => {
                navigate("/login");
              }}
            >
              Already Have An Acoount ?
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
