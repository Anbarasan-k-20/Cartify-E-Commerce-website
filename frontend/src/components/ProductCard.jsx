// src/components/ProductCard.jsx
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="h-100 shadow-sm text-center product-card"
      onClick={() => {
        // console.log("PRODUCT ID:", product._id);
        navigate(`/product/${product._id}`);
      }}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={product.image}
        alt={product.title}
        style={{ height: "260px", objectFit: "contain" }}
      />

      <Card.Body>
        <Card.Title className="fw-bold">{product.title}</Card.Title>

        <Card.Text className="text-primary fw-semibold">
          ₹{product.price}
        </Card.Text>

        {/* Show only 2 lines of description */}
        <Card.Text
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "14px",
          }}
        >
          {product.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
