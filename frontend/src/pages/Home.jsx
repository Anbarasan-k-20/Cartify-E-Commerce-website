// Home.jsx
import Deals from "../components/Deals";
import Products from "../components/Products";

const Home = () => {
  return (
    <>
      <div className="container-fluid">
        {/* 🔥 DEAL SWAPPER AT THE TOP */}
        <Deals />
        
        {/* 🔥 PRODUCTS BELOW */}
        <Products />
      </div>
    </>
  );
};

export default Home;