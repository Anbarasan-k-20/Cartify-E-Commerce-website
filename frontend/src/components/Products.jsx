import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import useFetch from "./customHook/useFetch";
import { GiShoppingCart } from "react-icons/gi";
import { FcLike } from "react-icons/fc";
import { Atom } from "react-loading-indicators";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSliderReducer";
const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, isError } = useFetch(
    "http://localhost:3000/api/v1/products"
  );
  const handleCart = (product) => {
    dispatch(addToCart(product));
  };
  if (loading) {
    return (
      <>
        <div className="d-flex justify-content-center align-items-center vh-100">
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
          <h2 className="mb-4">Products ({products?.length || 0})</h2>
          <div className="row">
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <div className="col-md-4 mb-4" key={product._id || index}>
                  <Card className="h-100 shadow-sm text-center product-card">
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
                      <Card.Text className="text-muted">
                        {product.category}
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          onClick={() => handleCart(product)}
                          variant="dark"
                          className="d-flex gap-2 align-items-center justify-content-center"
                        >
                          <span>
                            <GiShoppingCart />
                          </span>
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="d-flex gap-2 align-items-center justify-content-center"
                        >
                          <span>
                            <FcLike />
                          </span>
                          Add to Favorite
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No products found. Add some products first!</p>
              </div>
            )}
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
