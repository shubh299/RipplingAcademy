import React from "react";
  
const CartContext = React.createContext({
  cart: new Map(),
  cartFunctions: {}
});

export default CartContext;