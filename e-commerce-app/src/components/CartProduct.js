import { useContext } from "react";
import CartContext from "../context/CartContext";
import { Link } from "react-router-dom";

import "../Styles/common.css"
import "../Styles/CartProduct.css";

const CartProduct = (props) => {
  const { cartUpdater } = useContext(CartContext);
  let quantity = props.quantity;
  const quantitySelector = [];
  for (let i = 1; i <= props.product.quantityLimit; i++) {
    quantitySelector.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return (
    <div className="Cart-product" key={props.product.sku}>
      <div className="Cart-product-image">
        <Link to={`/product/${props.product.sku}`}><img src={props.product.image} alt={props.product.name} /> </Link>
      </div>
      <div className="Cart-product-title"><Link to={`/product/${props.product.sku}`}>{props.product.name}</Link></div>
      <div className="Cart-product-price">
        Price: {props.product.salePrice} * {quantity} ={" "}
        {(props.product.salePrice * quantity).toFixed(2)}
      </div>
      <div className="Cart-product-quantity">
        Quantity{`(max: ${props.product.quantityLimit})`}:
        <select
          className="Quantity-selection"
          defaultValue={quantity}
          onChange={(event) => {
            quantity = event.target.value;
          }}
        >
          {quantitySelector}
        </select>
        <button
          className="Update-cart"
          onClick={() => {
            cartUpdater.add(props.product, quantity);
          }}
        >
          Update Quantity
        </button>
        <button
          className="Remove-cart"
          onClick={() => {
            cartUpdater.delete(props.product.sku);
          }}
        >
          Remove From Cart
        </button>
      </div>
    </div>
  );
};

export default CartProduct;
