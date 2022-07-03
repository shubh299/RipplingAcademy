import { useContext } from "react";
import CartContext from "../Context/CartContext";
import CartProduct from "../Components/CartProduct";

import "./Styles/CartPage.css";
import "./Styles/common.css";

const Cartpage = () => {
  const { cart } = useContext(CartContext);
  let totalPrice = 0;
  const cartListDOM = [...cart].map((element) => {
    const product = element[1][0];
    const quantity = element[1][1];
    totalPrice += product.salePrice * quantity;
    return (
      <CartProduct product={product} quantity={quantity} key={product.sku} />
    );
  });

  return (
    <div className="Page">
      <div className="Below-NavBar">
        <div className="Checkout-wrapper">
          <div className="Product-list-wrapper">{cartListDOM}</div>
          <div className="Checkout-details">
            Total Price = {totalPrice.toFixed(2)}<br/>
            <button className="Checkout-button">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartpage;
