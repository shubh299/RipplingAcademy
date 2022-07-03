import ProductPage from "./ProductPage";
import React, { useState } from "react";
import HomePage from "./HomePage";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Cartpage from "./CartPage";
import CartContext from "./CartContext";
import "./App.css";

const Approutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/product/:product_id",
      element: <ProductPage />,
    },
    {
      path: "/checkout",
      element: <Cartpage />,
    },
    {
      path: "*",
      element: `Page Not Found`,
    },
  ]);
  return routes;
};

function App() {
  const cartUpdater = {
    add: (product, quantity) => {
      let prev_cart = [...cart];
      prev_cart = new Map(prev_cart);
      prev_cart.set(product.sku, [product, quantity]);
      localStorage.setItem('cart',JSON.stringify([...prev_cart]));
      setCart(prev_cart);
      // if()
    },
    delete: (sku) => {
      let prev_cart = [...cart];
      prev_cart = new Map(prev_cart);
      prev_cart.delete(sku);
      localStorage.setItem('cart',JSON.stringify([...prev_cart]));
      setCart(prev_cart);
    },
  };

  const [cart, setCart] = useState(() => {
    const local_storage_cart = localStorage.getItem('cart');
    if(local_storage_cart){
      return new Map(JSON.parse(local_storage_cart));
    }
    else{
      return new Map();
    }
  });

  return (
    <div className="App">
      <CartContext.Provider value={{ cart: cart, cartUpdater }}>
        <BrowserRouter>
          <Approutes />
        </BrowserRouter>
      </CartContext.Provider>
    </div>
  );
}

export default App;
