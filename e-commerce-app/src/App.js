import ProductPage from "./ProductPage";
import React, { useState } from "react";
import HomePage from "./HomePage";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Cartpage from "./CartPage";
import CartContext from "./CartContext";
import storage from "./apis/persistent_storage_api";

import "./Styles/App.css";
import NavBar from "./NavBar";

const Approutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/index",
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
      storage.update('cart',prev_cart);
      setCart(prev_cart);
    },
    delete: (sku) => {
      let prev_cart = [...cart];
      prev_cart = new Map(prev_cart);
      prev_cart.delete(sku);
      storage.update('cart',prev_cart);
      setCart(prev_cart);
    },
  };

  const [cart, setCart] = useState(() => {
    const local_storage_cart = storage.get('cart');
    if(local_storage_cart){
      return new Map(local_storage_cart);
    }
    else{
      return new Map();
    }
  });

  return (
    <div className="App">
      <CartContext.Provider value={{ cart: cart, cartUpdater }}>
        <BrowserRouter>
          <NavBar />
          <Approutes />
        </BrowserRouter>
      </CartContext.Provider>
    </div>
  );
}

export default App;
