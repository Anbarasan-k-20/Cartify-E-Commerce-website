import React from "react";

const Login = () => {
  return (
    <>
      <div className="container">
        <div
          className="d-flex flex-column justify-content-center gap-3 mt-5"
          style={{ maxWidth: "300px", margin: "auto" }}
        >
          <h4 className="text-center my-3">Login Form</h4>
          <label htmlFor="">User Name</label>
          <input className="form-control my-1" type="text" />
          <label htmlFor="">Password</label>
          <input className="form-control my-1" type="password" />
          <button className="btn btn-outline-dark mt-2">Login</button>

          <a style={{ textAlign: "center", textDecoration: null }} href="#">
            Don't Have An Account
          </a>
        </div>
      </div>
    </>
  );
};

export default Login;
1;
