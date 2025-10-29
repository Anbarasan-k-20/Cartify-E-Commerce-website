const CreateAccount = () => {
  let handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="d-flex flex-column w-100 px-3 "
        style={{ maxWidth: "500px" }}
      >
        <form>
          <h4>Create Acoount</h4>
          <label className="form-label my-2">Full Name</label>
          <input className="form-control" type="text" />
          <label className="form-label my-2">Phone Number</label>
          <input className="form-control" type="number" />
          <label className="form-label my-2">E-mail</label>
          <input className="form-control" type="email" />
          <label className="form-label my-2">Password</label>
          <input className="form-control" type="text" />
          <label className="form-label my-2">Confirm Password</label>
          <input className="form-control" type="text" />
          <button
            onClick={handleSubmit}
            className="btn btn-dark mt-3"
            type="submit"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
