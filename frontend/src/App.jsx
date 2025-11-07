import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Products from "./components/Products";
import CreateAccount from "./pages/CreateAccount";
import Cart from "./components/Cart";
import "../src/App.css";
const App = () => {
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
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
