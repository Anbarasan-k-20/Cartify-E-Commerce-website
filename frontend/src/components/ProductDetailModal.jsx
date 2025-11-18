// ProductDetailModal.jsx
const ProductDetailModal = ({ product, onClose, onAddToCart, onBuyNow }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>

        <div className="modal-left">
          <img
            src={product.image}
            alt={product.title}
            className="modal-product-img"
          />
        </div>

        <div className="modal-right">
          <h3 className="fw-bold">{product.title}</h3>

          <h4 className="text-primary fw-semibold mt-2">₹{product.price}</h4>

          {product.discountPrice && (
            <p className="text-success">
              Discount Price: ₹{product.discountPrice}
            </p>
          )}

          <p className="mt-3">{product.description}</p>

          <p>
            <strong>Brand:</strong> {product.brand || "N/A"}
          </p>
          {/* <p>
            <strong>Stock:</strong> {product.stock}
          </p> */}
          <p>
            <strong>Category:</strong> {product.category}
          </p>

          {product.sizes?.length > 0 && (
            <div className="mt-2">
              <strong>Available Sizes:</strong>
              <div className="d-flex gap-2 mt-1 flex-wrap">
                {product.sizes.map((s, i) => (
                  <span key={i} className="size-pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions mt-4">
            <button
              className="btn btn-dark w-100"
              onClick={() => onBuyNow(product)}
            >
              Buy Now
            </button>

            {/* 🔧 FIX APPLIED: pass product into add-to-cart handler */}
            <button
              className="btn btn-primary w-100"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
