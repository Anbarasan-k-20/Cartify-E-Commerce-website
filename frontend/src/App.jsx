import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Products from "./components/Products";
import CreateAccount from "./pages/CreateAccount";
import Cart from "./components/Cart";
import "../src/App.css";
import ProductDetailPage from "./components/ProductDetailPage";
import PageNotFound from "./pages/PageNotFound";
import BuyProduct from "./pages/BuyProduct";
// import { useEffect } from "react";
import AdminDash from "./components/AdminDashboard";
const App = () => {
  //   useEffect(() => {
  //   // Check if user is logged in
  //   const token = localStorage.getItem("token");
  //   console.log("App mounted, token:", token ? "exists" : "not found");
  // }, []);
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/products"} element={<Products />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/createaccount"} element={<CreateAccount />} />
          <Route path={"/addproducts"} element={<AddProduct />} />
          <Route path={"/cart"} element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path={"/buyproduct"} element={<BuyProduct />} />
          <Route path={"/admindash"} element={<AdminDash />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default App;
