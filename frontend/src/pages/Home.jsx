// import { useState } from "react";
import Products from "../components/Products";
const Home = () => {
  return (
    <>
      <div className="container">
        <h3 className="my-4">Top Deals</h3>
        <Products />
        <footer>
          <div className="d-flex align-items-center justify-content-center my-5">
            <p>©2025 Cartify ALL Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
