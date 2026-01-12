import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Products from "./components/Products";
import CreateAccount from "./pages/CreateAccount";
import Cart from "./components/Cart";
import ProductDetailPage from "./components/ProductDetailPage";
import PageNotFound from "./pages/PageNotFound";
import BuyProduct from "./pages/BuyProduct";
import ProtectedRoute from "./Routes/ProtectedRoute";
import "../src/App.css";
import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />} />

        {/* ===== Protected Routes (Any logged-in user) ===== */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="user">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyproduct"
          element={
            <ProtectedRoute>
              <BuyProduct />
            </ProtectedRoute>
          }
        />

        {/* ===== Admin Only ===== */}
        <Route
          path="/addproducts"
          element={
            <ProtectedRoute role="admin">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* ===== Fallback ===== */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
