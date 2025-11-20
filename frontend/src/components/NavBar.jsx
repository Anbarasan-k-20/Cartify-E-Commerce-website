import { Link, useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { selectCartCount } from "../store/cartSliderReducer";
import { BsBagCheck } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";

const NavBar = () => {
  const count = useSelector(selectCartCount);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${query}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 shadow-sm">
      <div className="container d-flex align-items-center justify-content-between">
        {/* LOGO */}
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <PiShoppingCartSimpleBold size={28} color="grey" className="me-2" />
          CARTIFY
        </Link>

        <form
          // onChange={handleSearch}
          onClick={handleSearch}
          className="d-flex align-items-center flex-grow-1 mx-3"
          style={{ maxWidth: "600px" }}
        >
          <input
            className="form-control"
            placeholder="Search product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-success ms-2" type="submit">
            <CiSearch size={20} />
          </button>
        </form>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item me-2">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-item me-2">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>

            <li className="nav-item me-2">
              <Link
                to="/cart"
                className="nav-link d-flex align-items-center fw-bold"
              >
                <BsBagCheck />
                <span className="ms-1">({count})</span>
              </Link>
            </li>

            <li className="nav-item me-2">
              <Link to="/addproducts" className="nav-link">
                Add Product
              </Link>
            </li>

            <li className="nav-item me-2">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
