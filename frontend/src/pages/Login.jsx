import React from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  let navigate = useNavigate(); //  min-vh-100
  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="d-flex flex-column w-100 px-4 shadow-lg py-5 px-4 rounded-4"
          style={{ maxWidth: "350px" }}
        >
          <h4 className="pb-3">Login Form</h4>
          <label className="my-2">User Name</label>
          <input className="form-control my-1" type="text" />
          <label className="my-2" htmlFor="">
            Password
          </label>
          <input className="form-control my-1" type="password" />
          <button className="btn btn-dark mt-3">Login</button>

          <a
            style={{
              textAlign: "center",
              textDecoration: null,
              fontSize: "12px",
              marginTop: "10px",
            }}
            type="button"
            onClick={() => {
              navigate("/createaccount");
            }}
          >
            Don't Have An Account
          </a>
        </div>
      </div>
    </>
  );
};

export default Login;
1;
