// Product.jsx
import Card from "react-bootstrap/Card";
import { Atom } from "react-loading-indicators";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        setProducts(res.data.data);
      } catch (error) {
        setIsError(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // GET SEARCH QUERY
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search")?.toLowerCase() || "";

  // FILTER products by search query
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Atom color="#3d186aee" size="medium" text="Loading Products..." />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="my-3">Top Products</h3>
      <div className="row">
        {filteredProducts.map((product, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <Card
              className="h-100 shadow-sm text-center product-card"
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-card position-relative">
                {product.stock < 10 && (
                  <span
                    className="badge bg-danger px-2 py-1 position-absolute custom-badge"
                    style={{ top: "10px", left: "10px", zIndex: 1 }}
                  >
                    Only {product.stock} left!
                  </span>
                )}
              </div>
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.title}
                style={{ height: "300px", objectFit: "contain" }}
              />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <div>
                  <Card.Text>
                    <span
                      style={{ textDecoration: "line-through", color: "#888" }}
                    >
                      MRP ₹{product.price}
                    </span>
                  </Card.Text>
                  <Card.Text className="mb-3">
                    <strong>₹Discount Price {product.discountPrice}</strong>
                  </Card.Text>
                </div>

                <Card.Text
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}

        {isError && (
          <p className="text-danger text-center mt-5">
            Error loading products: {isError}
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
