import { useSelector } from "react-redux";
import { selectCartCount } from "../store/cartSliderReducer";

export default function CartIcon() {
  const count = useSelector(selectCartCount);

  return (
    <div className="position-relative">
      <i className="fa fa-shopping-cart fs-3"></i>

      {count > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{ fontSize: "0.7rem" }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
