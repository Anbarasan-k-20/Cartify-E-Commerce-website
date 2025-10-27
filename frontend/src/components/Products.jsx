import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import useFetch from "./customHook/useFetch";
import { GiShoppingCart } from "react-icons/gi";
import { FcLike } from "react-icons/fc";
// import { useState } from "react";
const Products = () => {
  const { products } = useFetch("https://fakestoreapi.com/products");
  // const [loading,setLoading]= useState(false)
  console.log(products);
  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Products</h2>
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
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
        </div>
      </div>
    </>
  );
};

export default Products;
