import FilledCart from "./Icons/FilledCart.svg";
import EmptyCart from "./Icons/EmptyCart.svg";

import { useContext } from "react";
import CartContext from "./CartContext";

import "./Styles/CartIcon.css";

const CartIconNavBar = () => {
  const { cart } = useContext(CartContext);
  if (cart.size === 0)
    return (
      <div className="Empty-cart">
        <img src={EmptyCart} alt={"Empty Cart"} />
      </div>
    );
  else
    return (
      <div className="Filled-cart">
        <img src={FilledCart} alt={"Filled Cart"} />
      </div>
    );
};

export default CartIconNavBar;
