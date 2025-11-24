import { Link, useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { selectCartCount } from "../store/cartSliderReducer";
import { BsBagCheck } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const NavBar = () => {
  // cart count from redux
  const count = useSelector(selectCartCount);
  // local state
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);

  // router navigate
  const navigate = useNavigate();

  // fetch categories once on mount using axios
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // endpoint mounted in your app.js: app.use("/api/v1/categories", categoryRoutes);
        const res = await axios.get(`${API}/categories`);
        // backend returns { success: true, data: categories }
        // console.log(res.data.data);

        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Category fetch failed:", err);
      }
    };

    loadCategories();
  }, []);

  // handle form submit (search)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 shadow-sm">
      <div className="container d-flex align-items-center justify-content-between">
        {/* LOGO */}
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <PiShoppingCartSimpleBold size={28} color="grey" className="me-2" />
          CARTIFY
        </Link>

        {/* SEARCH + CATEGORY: use onSubmit so Enter works and button acts correctly */}
        <form
          onSubmit={handleSearch}
          className="d-flex align-items-center flex-grow-1 mx-3"
          style={{ maxWidth: "600px" }}
        >
          {/* CATEGORY DROPDOWN */}
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
                        // prevent the form from receiving the click (which would submit)
                        e.stopPropagation();
                        // navigate to products page with search query as category name
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

          {/* SEARCH INPUT */}
          <input
            className="form-control"
            placeholder="Search product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />

          {/* SEARCH BUTTON */}
          <button
            className="btn btn-success ms-2"
            type="submit"
            aria-label="Search"
          >
            <CiSearch size={20} />
          </button>
        </form>

        {/* MOBILE TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV LINKS */}
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
