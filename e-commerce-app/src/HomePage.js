//TODO: Complete this page
import { createRef, useEffect, useState } from "react";
import {
  getCategories as getCategoriesFromApi,
  getFilteredProducts,
} from "./api";
import NavBar from "./NavBar";
import Spinner from "./Spinner";
import ProductCard from "./ProductCard";
import "./common.css";
import "./HomePage.css";

const min_price_ref = createRef();
const max_price_ref = createRef();

const products_per_page = 24;

let filterClass= 'Filters';

const sortOrder = {
  def: 0,
  asc: 1,
  desc: 2,
};

const HomePage = () => {
  const [loadedCategories, setLoadedCategories] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState(false);
  const [errorInInfo, setErrorInInfo] = useState(false);
  const [filterCategories, setFilterCategories] = useState(new Set());
  const [filterPrice, setFilterPrice] = useState(
    sessionStorage.getItem("filterPrice")
      ? JSON.parse(sessionStorage.getItem("filterPrice"))
      : { min: 0, max: 10000 }
  );
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSortMethod, setSelectedSortMethod] = useState(
    sessionStorage.getItem("selectedSortMethod")
      ? JSON.parse(sessionStorage.getItem("selectedSortMethod"))
      : sortOrder.def
  );
  const [currentPage, setCurrentPage] = useState(
    sessionStorage.getItem("currentPage")
      ? JSON.parse(sessionStorage.getItem("currentPage"))
      : 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [filterExpanded, setFilterExpanded] = useState(false);

  useEffect(() => {
    document.title = "Home";

    getCategoriesFromApi().then((result) => {
      if (result.error) {
        setErrorInInfo(true);
      } else {
        setErrorInInfo(false);
        setCategories(result.details.categories);
        setFilterCategories(
          new Set(result.details.categories.map((category) => category.id))
        );
      }
      setLoadedCategories(true);
    });
  }, []);

  useEffect(() => {
    setLoadedProducts(false);
    if (filterCategories.size > 0) {
      getFilteredProducts(
        Array.from(filterCategories),
        filterPrice,
        ["name", "sku", "image", "salePrice"],
        selectedSortMethod,
        currentPage,
        products_per_page
      ).then((result) => {
        if (result.error) {
          setErrorInInfo(true);
        } else {
          setErrorInInfo(false);
          setProductList(result.details.products);
          setTotalPages(result.details.pages);
          setCurrentPage(1);
        }
        setLoadedProducts(true);
      });
    }
    sessionStorage.setItem(
      "filterCategories",
      JSON.stringify(filterCategories)
    );
    sessionStorage.setItem(
      "filterCategories",
      JSON.stringify(filterCategories)
    );
    sessionStorage.setItem("filterPrice", JSON.stringify(filterPrice));
    sessionStorage.setItem("selectedSortMethod", selectedSortMethod);
    sessionStorage.setItem("currentPage", currentPage);
  }, [filterCategories, filterPrice, selectedSortMethod, currentPage]);

  useEffect(() => {
    console.log(filterExpanded);
    if(filterExpanded) filterClass = 'Filters Filter-expand';
    else filterClass = 'Filters Filter-collapse';
  },[filterExpanded]);

  const updateFilterCategories = (category, checked) => {
    let temp_category_set = new Set(filterCategories);
    if (checked) {
      if (temp_category_set.size === categories.length)
        temp_category_set.clear();
      temp_category_set.add(category);
    } else temp_category_set.delete(category);

    if (temp_category_set.size === 0)
      temp_category_set = new Set(categories.map((category) => category.id));
    setFilterCategories(temp_category_set);
  };

  const categoryDisplayDOM = categories.map((category) => {
    return (
      <div key={category.id}>
        <input
          className="Filter-categories-option"
          type="checkbox"
          id={category.id}
          value={category.id}
          onChange={(event) =>
            updateFilterCategories(event.target.id, event.target.checked)
          }
        />
        <label htmlFor={category.id}>{category.name}</label>
      </div>
    );
  });

  if (errorInInfo) {
    return (
      <div className="Page">
        <NavBar />
        <div className="Product-missing">
          <div className="Missing-text">No products found</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="Page">
        <NavBar />
        <div className="Below-NavBar">
          <div className="Wrapper-for-home">
            <button className="Hide-filter-button" onClick={() => {setFilterExpanded(!filterExpanded)}}>Filters</button>
            <div className={filterClass}>
              <b>Categories</b>
              {loadedCategories ? categoryDisplayDOM : <div></div>}
              <br />
              {loadedCategories ? (
                <div className="Price-filter">
                  <b>Price Range</b>
                  <br />
                  <div>
                    <input
                      type="number"
                      min={0}
                      max={filterPrice.max - 1}
                      defaultValue={filterPrice.min}
                      ref={min_price_ref}
                    />{" "}
                    {"to "}
                    <input
                      type="number"
                      min={filterPrice.min + 1}
                      max={10000}
                      defaultValue={filterPrice.max}
                      ref={max_price_ref}
                    />{" "}
                    <br />
                    <button
                      onClick={() => {
                        setFilterPrice({
                          min: min_price_ref.current.value,
                          max: max_price_ref.current.value,
                        });
                      }}
                    >
                      Update Price Range
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="Sort-product-input">
                Sort Products <br />
                <select
                  defaultValue={selectedSortMethod}
                  onChange={(event) => {
                    setSelectedSortMethod(event.target.value);
                  }}
                >
                  <option value={sortOrder.def}>default</option>
                  <option value={sortOrder.asc}>Price low to high</option>
                  <option value={sortOrder.desc}>Price high to low</option>
                </select>
              </div>
            </div>
            <div>
              <div className="Products-list">
                {loadedProducts ? (
                  productList.map((product) => {
                    return (
                      <ProductCard
                        sku={product.sku}
                        name={product.name}
                        image={product.image}
                        salePrice={product.salePrice}
                        key={product.sku}
                      />
                    );
                  })
                ) : (
                  <Spinner />
                )}
              </div>
              <div className="Page-changer">
                {currentPage === 1 ? (
                  ""
                ) : (
                  <button onClick={() => setCurrentPage(currentPage - 1)}>
                    {"<"}
                  </button>
                )}
                {currentPage}
                {currentPage === totalPages ? (
                  ""
                ) : (
                  <button onClick={() => setCurrentPage(currentPage + 1)}>
                    {">"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default HomePage;
