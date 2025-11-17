// src/components/ProductCard.jsx
import Card from "react-bootstrap/Card";
const ProductCard = ({ product, onClick }) => {
  return (
    <Card
      className="h-100 shadow-sm text-center product-card"
      onClick={onClick}
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
