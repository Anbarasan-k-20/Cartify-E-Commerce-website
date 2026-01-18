// components/Deals.jsx
import { useState, useEffect } from "react";
import deal1 from "../assets/ecom-Assets/baner-1.jpg";
import deal2 from "../assets/ecom-Assets/baner-2.jpg";
import deal3 from "../assets/ecom-Assets/baner-3.avif";
import deal4 from "../assets/ecom-Assets/baner-4.jpg";

// 👉 DEALS ARRAY (HARDCODED)
const deals = [deal1, deal2, deal3, deal4];

const Deals = () => {
  const [activeDealIndex, setActiveDealIndex] = useState(0);

  // 👉 AUTO-SWAP DEALS (ALL SCREEN SIZES)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDealIndex((prev) => (prev + 1) % deals.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid px-0 my-4">
      <div className="position-relative">
        <img
          src={deals[activeDealIndex]}
          alt={`Special Deal ${activeDealIndex + 1}`}
          className="w-100"
          style={{
            height: "350px",
            objectFit: "cover",
          }}
        />

        {/* 🔥 DEAL NAVIGATION DOTS */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
          {deals.map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm p-0 ${activeDealIndex === index ? "bg-primary" : "bg-white"}`}
              onClick={() => setActiveDealIndex(index)}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "1px solid #ccc",
              }}
              aria-label={`Go to deal ${index + 1}`}
            />
          ))}
        </div>

        {/* 🔥 MANUAL NAVIGATION BUTTONS */}
        <button
          className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle border-0 shadow-sm"
          onClick={() =>
            setActiveDealIndex((prev) =>
              prev === 0 ? deals.length - 1 : prev - 1
            )
          }
          style={{
            marginLeft: "20px",
            width: "45px",
            height: "45px",
            opacity: 0.9,
            fontSize: "1.2rem",
          }}
        >
          ‹
        </button>
        <button
          className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle border-0 shadow-sm"
          onClick={() =>
            setActiveDealIndex((prev) => (prev + 1) % deals.length)
          }
          style={{
            marginRight: "20px",
            width: "45px",
            height: "45px",
            opacity: 0.9,
            fontSize: "1.2rem",
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Deals;
