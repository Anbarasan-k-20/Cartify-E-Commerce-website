import { Link } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { selectCartCount } from "../store/cartSliderReducer";
import { BsBagCheck } from "react-icons/bs";
const NavBar = () => {
  const count = useSelector(selectCartCount);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <PiShoppingCartSimpleBold size={28} color="grey" className="me-2" />
          CARTIFY
        </Link>

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
            <li className="nav-item me-1">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-item me-1">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>

            <li className="nav-item me-1">
              <Link to="/cart" className="nav-link d-flex align-items-center">
                <BsBagCheck />
                <span className="ms-1" style={{ fontWeight: "600" }}>
                  ({count})
                </span>
              </Link>
            </li>

            <li className="nav-item me-md-1">
              <Link to="/addproducts" className="nav-link">
                Add Product
              </Link>
            </li>

            <li className="nav-item me-1">
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
