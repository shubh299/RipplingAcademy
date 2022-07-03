import React from "react";

// const cartProduct = new Map();

//cart structure sku:[product,quantity]
  
const CartContext = React.createContext({
  cart: new Map(),
  cartFunctions: {}
});

export default CartContext;