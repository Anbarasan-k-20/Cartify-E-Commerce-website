import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import useFetch from "./customHook/useFetch";
import { GiShoppingCart } from "react-icons/gi";
import { FcLike } from "react-icons/fc";
import { Atom } from "react-loading-indicators";
const Products = () => {
  const { products, loading, isError } = useFetch(
    "https://fakestoreapi.com/products"
  );
  if (loading) {
    return (
      <>
        <div
          style={{ height: "50vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <Atom
            color="#6500dd"
            size="medium"
            text="Content Loading"
            textColor=""
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container mt-4">
          <h2 className="text-center mb-4">Products</h2>
          <div className="row">
            {products.map((product, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <Card className="h-100 shadow-sm text-center">
                  <div
                    style={{
                      height: "300px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: "auto",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title style={{ minHeight: "60px" }}>
                      {product.title}
                    </Card.Title>
                    <Card.Text>
                      <strong>₹{product.price}</strong>
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="dark"
                        className="d-flex gap-2 align-items-center justify-content-center"
                      >
                        <span>
                          <GiShoppingCart />
                        </span>
                        Add to Cart
                      </Button>
                      <Button
                        variant="Danger"
                        className="d-flex gap-2 align-items-center justify-content-center"
                      >
                        <span>
                          <FcLike />
                        </span>
                        Add to Favaroite
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
            {isError && (
              <p className="text-danger text-center mt-5">Error: {isError}</p>
            )}
          </div>
        </div>
      </>
    );
  }
};
export default Products;
