// import { useState } from "react";
import Products from "../components/Products";
const Home = () => {
  return (
    <>
      <div className="container">
        <Products />
        <footer>
          <div className="d-flex align-items-center justify-content-center my-5">
            <p>©2025 Cartify,Vyoobam Tech</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
