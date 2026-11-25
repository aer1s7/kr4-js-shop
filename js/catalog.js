const productsContainer = document.querySelector("[data-products-container]");
const searchInput = document.querySelector("#catalog-search");
const categoryFilter = document.querySelector("#category-filter");
const sortSelect = document.querySelector("#sort-select");
const catalogCount = document.querySelector(".catalog-count");
const catalogEmpty = document.querySelector(".catalog-empty");
const priceFrom = document.querySelector("#price-from");
const priceTo = document.querySelector("#price-to");

if (!productsContainer) {
  console.warn(
    "Контейнер товаров не найден. Проверьте data-products-container.",
  );
}

function getProductTitles(products) {
  return products.map((product) => product.title);
}

function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === "") {
    return products;
  }

  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

function filterProductsByCategory(products, category) {
  if (category === "all") {
    return products;
  }

  return products.filter((product) => {
    return product.category === category;
  });
}

function sortProductsByPrice(products, direction = "default") {
  const productsCopy = [...products];

  if (direction === "price-desc") {
    return productsCopy.sort((a, b) => b.price - a.price);
  } else if (direction === "price-asc") {
    return productsCopy.sort((a, b) => a.price - b.price);
  } else if (direction === "title-asc") {
    return productsCopy.sort((product) => product.title);
  }

  return productsCopy;
}

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

function calculateTotalPrice(products) {
  return products.reduce((sum, product) => {
    return sum + product.price;
  }, 0);
}

function countAvailableProducts(products) {
  return products.filter((product) => product.isAvailable).length;
}

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }

  const totalPrice = calculateTotalPrice(products);
  return Math.round(totalPrice / products.length);
}

function getProductsByPriceRange(products, startPrice, endPrice) {
  if (!endPrice) {
    return products.filter((product) => {
      return product.price >= startPrice;
    });
  }
  return products.filter((product) => {
    return product.price >= startPrice && product.price <= endPrice;
  });
}

function getPreparedProducts(
  products,
  query,
  category,
  sortDirection,
  startPrice,
  endPrice,
) {
  let result = [...products];

  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);
  result = getProductsByPriceRange(result, startPrice, endPrice);

  return result;
}

function formatPrice(price) {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const image = document.createElement("img");
  image.classList.add("product-card__image");
  image.src = product.image;
  image.alt = product.title;

  const title = document.createElement("h3");
  title.classList.add("product-card__title");
  title.textContent = product.title;

  const status = document.createElement("p");
  status.classList.add("product-card__status");
  status.textContent = product.isAvailable ? "В наличии" : "Нет в наличии";
  if (!product.isAvailable) {
    status.classList.add("product-card__status--unavailable");
  }

  const description = document.createElement("p");
  description.classList.add("product-card__description");
  description.textContent = product.description;

  const price = document.createElement("p");
  price.classList.add("product-card__price");
  price.textContent = formatPrice(product.price);

  const button = document.createElement("button");
  button.classList.add("product-card__button");
  button.type = "button";
  button.textContent = "В корзину";
  button.dataset.action = "add-to-cart";
  button.dataset.productId = String(product.id);

  if (!product.isAvailable) {
    button.textContent = "В корзину";
    button.classList.add("product-card__button--unavailable");
    button.disabled = true;
  }

  card.append(image, title, description, price, status, button);

  return card;
}

function renderProducts(productsToRender) {
  productsContainer.textContent = "";

  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = productsToRender.length > 0;
  }

  productsToRender.forEach((product) => {
    const card = createProductCard(product);
    productsContainer.append(card);
  });
}

function updateCatalog() {
  const preparedProducts = getPreparedProducts(
    products,
    catalogState.query,
    catalogState.category,
    catalogState.sort,
    catalogState.startPrice,
    catalogState.endPrice,
  );
  renderProducts(preparedProducts);
}

const catalogState = {
  query: "",
  category: "all",
  sort: "default",
  startPrice: 0,
  endPrice: Number.MAX_SAFE_INTEGER,
};

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    catalogState.query = event.target.value;
    updateCatalog();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", (event) => {
    catalogState.category = event.target.value;
    updateCatalog();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", (event) => {
    catalogState.sort = event.target.value;
    updateCatalog();
  });
}

if (priceFrom || priceTo) {
  priceFrom.addEventListener("input", (event) => {
    catalogState.startPrice = event.target.value;
    updateCatalog();
  });
  priceTo.addEventListener("input", (event) => {
    catalogState.endPrice = event.target.value;
    updateCatalog();
  });
}

if (productsContainer) {
  updateCatalog();
}

if (productsContainer) {
  productsContainer.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="add-to-cart"]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.productId);
    const selectedProduct = products.find(
      (product) => product.id === productId,
    );

    if (!selectedProduct) {
      console.warn("Товар не найден:", productId);
      return;
    }

    console.log(`Товар добавлен в корзину: ${selectedProduct.title}`);
    cartItems.push(selectedProduct);
    updateCartCounter();
  });
}

const cartCounter = document.querySelector(".cart-counter");
const cartItems = [];

function updateCartCounter() {
  if (cartCounter) {
    cartCounter.textContent = `В корзине: ${cartItems.length}`;
    cartCounter.hidden = false;
    announce(
      `${cartItems.at(-1).title} добавлен в корзину (${cartItems.length}).`,
    );
  }
}
