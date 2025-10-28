import React from "react";

const Login = () => {
  return (
    <>
      <div className="container justify-content-center px-5 align-items-center min-vh-100">
        <div
          className="card shadow-lg mt-5 py-5 px-4"
          style={{ maxWidth: "300px", margin: "auto" }}
        >
          <h4 className="text-center my-3">Login Form</h4>
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
            href="#"
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
