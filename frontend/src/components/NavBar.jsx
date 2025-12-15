import { Link, useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { selectCartCount } from "../store/cartSlice";
import { BsBagCheck } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;
// ...imports remain unchanged
const NavBar = () => {
  const count = useSelector(selectCartCount);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`);
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Category fetch failed:", err);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 shadow-sm">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <PiShoppingCartSimpleBold size={28} color="grey" className="me-2" />
          CARTIFY
        </Link>

        <form
          onSubmit={handleSearch}
          className="d-flex align-items-center flex-grow-1 mx-3"
          style={{ maxWidth: "600px" }}
        >
          <div className="dropdown me-2">
            <button
              className="btn btn-outline-light dropdown-toggle text-dark bg-white"
              type="button"
              data-bs-toggle="dropdown"
            >
              Category
            </button>
            <ul className="dropdown-menu">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/products?search=${encodeURIComponent(cat.name)}`
                        );
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="dropdown-item disabled">Loading...</li>
              )}
            </ul>
          </div>

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

            {user?.role === "admin" && (
              <li className="nav-item me-2">
                <Link to="/addproducts" className="nav-link">
                  Add Product
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li className="nav-item me-2">
                  <span className="nav-link fw-bold text-white bg-secondary rounded-circle px-3">
                    {user.fullname?.charAt(0).toUpperCase()}
                  </span>
                </li>
                <li className="d-flex align-items-center justify-center nav-item me-2">
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item me-2">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            )}

            {/*   For Dev Purpose*/}
            {/* <li className="nav-item me-2">
              <Link to="/buyproduct" className="nav-link">
                BuyProduct
              </Link>
            </li> */}
            {/*   For Dev Purpose*/}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
