import { Link } from "react-router-dom";

import "./Styles/ProductCard.css";

const ProductCard = (props) => {
  return (
    <Link className="Product-window-link" to={`/product/${props.sku}`}>
      <div className="Product-window-wrapper">
        <div className="Product-image-wrapper">
          <img src={props.image} alt={props.name} />
        </div>
        <div className="Product-window-title">{props.name}</div>
        <div className="Product-window-price">Price: {props.salePrice}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
