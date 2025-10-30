import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

import { GiFallDown } from "react-icons/gi";

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

    setCreate({
      ...create,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (create.password !== create.confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Account created:", create);
    setAlertMsg(true);

    setCreate({
      fullname: "",
      phone: "",
      email: "",
      password: "",
      confirmpassword: "",
    });

    setTimeout(() => {
      setAlertMsg(false);
    }, 3000);
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
                type="number"
              />
              <label className="form-label my-2">E-mail</label>
              <input
                className="form-control"
                value={create.email}
                name="email"
                onChange={handlechange}
                type="email"
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
              <button
                onClick={handleSubmit}
                className="btn btn-dark mt-3"
                onChange={handlechange}
                type="submit"
              >
                Create Account
              </button>
            </form>
            <a
              style={{
                textAlign: "center",
                textDecoration: null,
                fontSize: "12px",
                marginTop: "10px",
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
