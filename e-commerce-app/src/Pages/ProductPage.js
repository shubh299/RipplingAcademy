import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getProductInfo } from "./apis/product_api";
import Spinner from "../Components/Spinner";
import CartContext from "../Context/CartContext";

import "./Styles/ProductPage.css";
import "./Styles/common.css";

//TODO: update CSS
const ProductPage = () => {
  const { cart, cartUpdater } = useContext(CartContext);
  let { product_id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [productFound, setProductFound] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    document.title = "";
    getProductInfo(product_id, [
      "sku",
      "name",
      "salePrice",
      "description",
      "longDescription",
      "quantityLimit",
      "image",
    ]).then((result) => {
      if (result.error) {
        setProductFound(false);
      } else {
        setProductFound(true);
        setProductDetails(result.details.product);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (productDetails != null) document.title = productDetails.name;
  }, [productDetails]);

  if (!loaded) {
    return (
      <div className="Page">
        <Spinner />
      </div>
    );
  } else if (!productFound)
    return (
      <div className="Page">
        <div className="Product-missing">
          <div className="Missing-text">Product Not Found</div>
        </div>
      </div>
    );
  else
    return (
      <div className="Page">
        <div className="Below-NavBar">
          <div className="Product">
            <div className="Product-image">
              <img src={productDetails.image} alt={productDetails.name} />
            </div>
            <div className="Product-details">
              <div className="Product-name">{productDetails.name}</div>
              Price: {productDetails.salePrice} <br />
              <div className="Product-description">
              {productDetails.description
                ? productDetails.description
                : productDetails.longDescription}{" "}
                </div>
              <div>
                Quantity{`(max: ${productDetails.quantityLimit})`}
                <div className="Quantity-update">
                  <button
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={productDetails.quantityLimit}
                    value={quantity}
                    readOnly={true}
                  />
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(quantity + 1, productDetails.quantityLimit)
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <div className="Product-page-cart-buttons">
                <button
                  className="Update-cart"
                  onClick={() => {
                    cartUpdater.add(productDetails, quantity);
                  }}
                >
                  {cart.has(productDetails.sku) ? "Update Cart" : "Add To Cart"}
                </button>
                {cart.has(productDetails.sku) ? (
                  <button
                    className="Remove-cart"
                    onClick={() => {
                      cartUpdater.delete(productDetails.sku);
                    }}
                  >
                    Remove From Cart
                  </button>
                ) : (
                  ""
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ProductPage;
