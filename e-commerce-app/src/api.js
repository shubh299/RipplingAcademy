const api_key = "qhqws47nyvgze2mq3qx4jadt"; //taken from https://basecamp.temenos.com/s/question/0D52K00004Wp4p2SAB/unable-to-register-on-the-bestbuy-developer-portal-for-api-key

const api_url = "https://api.bestbuy.com/v1";

//first is error boolean, second is required details array (or object if one), last is number of pages
const reply_format = { error: false, details: {} };

const sortMethods = {
    0: '',
    1: 'salePrice.asc',
    2: 'salePrice.dsc'
};

//specifying categories to limit the number of categories
const getCategories = async () => {
  const categories = [
    "abcat0101000",
    "abcat0102000",
    "abcat0104000",
    "abcat0106000",
    "abcat0107000",
    "abcat0201000",
    "abcat0202001",
    "abcat0205000",
    "abcat0304000",
    "abcat0305000",
    "abcat0401000",
    "abcat0403000",
    "abcat0404000",
    "abcat0408000",
    "abcat0409000",
    "abcat0410000",
  ];
  const categoryFilter = categories.join("|id=");
  return fetch(
    `${api_url}/categories(active=true&(id=${categoryFilter}))?format=json&show=id,name&pageSize=${categories.length}&page=1&apiKey=${api_key}`
  )
    .then(
      (response) => response.json(),
      (error) => {
        console.log(error);
        const reply = Object.create(reply_format);
        reply.error = true;
        return reply;
      }
    )
    .then(
      (result) => {
        const reply = Object.create(reply_format);
        if (result.categories.length > 0) {
          reply.error = false;
          reply.details.categories = result.categories;
        } else {
          reply.error = true;
        }
        return reply;
      },
      (error) => {
        const reply = Object.create(reply_format);
        console.log(error);
        reply.error = true;
        return reply;
      }
    );
};

const getProductInfo = (id, info_parameters) => {
  let parameters = info_parameters.join(",");
  return fetch(
    `${api_url}/products(sku=${id}&active=true)?format=json&show=${parameters}&apiKey=${api_key}`
  ).then(
    (response) => response.json(),
    (error) => {
      console.log("error", error);
      const reply = Object.create(reply_format);
      reply.error = true;
      return reply;
    }
  )
  .then(
    (result) => {
        const reply = Object.create(reply_format);
      if (result.products.length > 0) {
        reply.error = false;
        reply.details.product = result.products[0];
      } else {
        reply.error = true;
      }
      return reply;
    },
    (error) => {
      console.log("error", error);
      const reply = Object.create(reply_format);
      reply.error = true;
      return reply;
    }
  );
};

const getFilteredProducts = (
  filter_categories,
  filter_price,
  parameters,
  selectedSortOrder,
  page,
  products_per_page
) => {
  const min_price = filter_price.min;
  const max_price = filter_price.max;

  const sortOrder = sortMethods[selectedSortOrder];

  let category_filter_string = `categoryPath.id=`;
  if (filter_categories.length > 0) {
    category_filter_string += filter_categories.join(`| categoryPath.id=`);
  }
   return fetch(
    `${api_url}/products((${category_filter_string})&(salePrice>=${min_price}&salePrice<=${max_price})&active=true)?format=json&show=${parameters}&sort=${sortOrder}&pageSize=${products_per_page}&page=${page}&apiKey=${api_key}`
  )
    .then(
      (response) => response.json(),
      (error) => {
        console.log(error);
        const reply = Object.create(reply_format);
        return reply;
      }
    )
    .then(
      (result) => {
        const reply = Object.create(reply_format);
        if (result.products.length > 0) {
          reply.error = false;
          reply.details.products = result.products;
          reply.details.pages = result.totalPages;
        } else {
          reply.error = true;
        }
        return reply;
      },
      (error) => {
        console.log(error);
        const reply = Object.create(reply_format);
        return reply;
      }
    );
};

export { getProductInfo, getCategories, getFilteredProducts };
