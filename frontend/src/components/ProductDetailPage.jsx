import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Atom } from "react-loading-indicators";
const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!product)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Atom color="#3d186aee" size="medium" text="Loading Products..." />
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.title} className="img-fluid" />
        </div>

        <div className="col-md-6">
          <h2>{product.title}</h2>
          <strike>
            <h4>₹{product.price}</h4>
          </strike>
          <h4>₹{product.discountPrice}</h4>
          <p>MRP (Inclusive of all taxes)</p>
          <p>{product.description}</p>

          <button className="btn btn-primary w-100 mt-3">Buy Now</button>
          <button className="btn btn-dark w-100 mt-2">Add to Cart</button>
        </div>
        <div className="row">
          <div className="col-12 text-center p-5 m-5">
            {" "}
            here display the relatedd products
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
