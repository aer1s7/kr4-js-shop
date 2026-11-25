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

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === "") return products;
  return products.filter((product) =>
    product.title.toLowerCase().includes(normalizedQuery),
  );
}

function filterProductsByCategory(products, category) {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
}

function sortProductsByPrice(products, direction = "default") {
  const copy = [...products];
  if (direction === "price-desc") return copy.sort((a, b) => b.price - a.price);
  if (direction === "price-asc") return copy.sort((a, b) => a.price - b.price);
  if (direction === "title-asc")
    return copy.sort((a, b) => a.title.localeCompare(b.title, "ru"));
  return copy;
}

function getProductsByPriceRange(products, startPrice, endPrice) {
  return products.filter(
    (product) => product.price >= startPrice && product.price <= endPrice,
  );
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
  image.loading = "lazy";

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
  button.classList.add("product-card__button", "button");
  button.type = "button";
  button.dataset.action = "add-to-cart";
  button.dataset.productId = String(product.id);
  button.textContent = "В корзину";

  if (!product.isAvailable) {
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
    productsContainer.append(createProductCard(product));
  });
}

const catalogState = {
  query: "",
  category: "all",
  sort: "default",
  startPrice: 0,
  endPrice: Number.MAX_SAFE_INTEGER,
};

function updateCatalog() {
  renderProducts(
    getPreparedProducts(
      products,
      catalogState.query,
      catalogState.category,
      catalogState.sort,
      catalogState.startPrice,
      catalogState.endPrice,
    ),
  );
}

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

if (priceFrom) {
  priceFrom.addEventListener("input", (event) => {
    catalogState.startPrice = Number(event.target.value) || 0;
    updateCatalog();
  });
}

if (priceTo) {
  priceTo.addEventListener("input", (event) => {
    catalogState.endPrice =
      Number(event.target.value) || Number.MAX_SAFE_INTEGER;
    updateCatalog();
  });
}

if (productsContainer) {
  updateCatalog();
}
