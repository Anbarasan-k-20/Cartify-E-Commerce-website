import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
const Login = () => {
  let navigate = useNavigate(); //  min-vh-100
  const [alertMsg, setAlertMsg] = useState(false);
  const [fields, setFields] = useState({
    uName: "",
    password: "",
  });
  let handleChange = (e) => {
    let { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };
  let handleSubmit = (e) => {
    e.preventDefault();
    if (!fields.uName || !fields.password) {
      alert("Please Fill All The Fields");
      return;
    }
    console.log(fields);
    setFields({
      uName: "",
      password: "",
    });
    setAlertMsg(true);

    setTimeout(() => {
      setAlertMsg(false);
    }, 3000);
  };
  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: "350px", width: "100%" }}
        >
          {alertMsg && (
            <Alert severity="success" className="mb-3">
              Login Success
            </Alert>
          )}
          <div
            className="d-flex flex-column shadow-lg py-5 px-4 rounded-4"
            //
          >
            <h4 className="pb-3">Login Form</h4>
            <label className="my-2">User Name</label>
            <input
              className="form-control my-1"
              onChange={handleChange}
              type="text"
              name="uName"
              value={fields.uName}
            />

            <label className="my-2" htmlFor="">
              Password
            </label>
            <input
              className="form-control my-1"
              onChange={handleChange}
              type="password"
              name="password"
              value={fields.password}
            />
            <div>
              <button type="submit" className="btn btn-dark mt-3">
                Login
              </button>
            </div>

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
        </form>
      </div>
    </>
  );
};

export default Login;
