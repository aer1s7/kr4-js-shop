const STORAGE_CART = "shop_cart";
const MAX_QTY = 99;

function readStorage() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_CART) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeStorage(value) {
  try {
    localStorage.setItem(STORAGE_CART, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function restoreCart() {
  const result = [];
  readStorage().forEach((item) => {
    if (!item || typeof item !== "object") return;
    const product = (window.products || []).find(
      (p) => p.id === item.productId,
    );
    if (!product || !product.isAvailable) return;
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY)
      return;
    if (result.some((row) => row.productId === product.id)) return;
    result.push({ productId: product.id, quantity });
  });
  return result;
}

let cart = restoreCart();
let storageProblem = false;

function findProduct(id) {
  return (window.products || []).find((p) => p.id === id);
}

function formatPrice(price) {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function createProductImage(product, className) {
  const image = document.createElement("img");
  image.className = className;
  image.src = product.image;
  image.alt = product.title;
  image.width = 640;
  image.height = 480;
  image.loading = "lazy";
  return image;
}

function createActionButton(action, productId, text, className = "button") {
  const button = createElement("button", className, text);
  button.type = "button";
  button.dataset.action = action;
  button.dataset.productId = String(productId);
  return button;
}

function announce(message) {
  const status = document.querySelector(".cart-msg");
  if (!status) return;
  status.hidden = false;
  status.textContent = message;
  clearTimeout(announce.timer);
  announce.timer = setTimeout(() => {
    status.textContent = "";
    status.hidden = true;
  }, 6000);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = findProduct(item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function updateCartCounters() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
  });
  const counter = document.querySelector(".cart-counter");
  if (counter) {
    counter.textContent = `В корзине: ${count}`;
    counter.hidden = count === 0;
  }
}

function saveCart() {
  const ok = writeStorage(cart);
  storageProblem = !ok;
  if (!ok) announce("Не удалось сохранить корзину в браузере.");
  updateCartCounters();
  renderCart();
}

function addToCart(id) {
  const product = findProduct(id);
  if (!product || !product.isAvailable) return;

  const item = cart.find((row) => row.productId === id);
  if (item) {
    if (item.quantity >= MAX_QTY) return;
    item.quantity += 1;
  } else {
    cart.push({ productId: id, quantity: 1 });
  }
  saveCart();
  announce(`«${product.title}» добавлен в корзину.`);
}
function renderCart() {
  const container = document.querySelector("[data-cart-list]");
  if (!container) return;

  container.replaceChildren();

  const summary = document.querySelector("[data-cart-summary]");
  const subtotal = document.querySelector("[data-cart-subtotal]");
  const checkout = document.querySelector("[data-checkout]");

  if (summary) summary.textContent = `Всего товаров: ${getCartCount()}`;
  if (subtotal) subtotal.textContent = formatPrice(getCartTotal());
  if (checkout) checkout.hidden = cart.length === 0;

  if (cart.length === 0) {
    const empty = createElement("div", "empty-state");
    empty.append(
      createElement("h2", "", "Корзина пока пуста"),
      createElement("p", "card-description", "Выберите товар в каталоге."),
    );
    const link = createElement("a", "button", "Перейти в каталог");
    link.href = "catalog.html";
    empty.append(link);
    container.append(empty);
    return;
  }

  cart.forEach((item) => {
    const product = findProduct(item.productId);
    if (!product) return;

    const row = createElement("article", "cart-item");
    row.dataset.cartProduct = String(product.id);

    // 1. Картинка
    const image = createProductImage(product, "cart-item__image");

    // 2. Левая часть с информацией (Название, Цена за шт, Количество)
    const info = createElement("div", "cart-item__info");

    const heading = createElement("h2", "cart-item__title");
    const link = createElement("a", "", product.title);
    link.href = "product.html";
    heading.append(link);

    const unitPrice = createElement(
      "p",
      "card-description cart-item__unit-price",
      `${formatPrice(product.price)} за шт.`,
    );

    const quantity = createElement("div", "quantity-controls");
    const minus = createActionButton("decrease", product.id, "−");
    minus.setAttribute("aria-label", `Уменьшить количество: ${product.title}`);
    minus.disabled = item.quantity <= 1;

    const count = createElement("span", "", `${item.quantity} шт.`);
    count.setAttribute("aria-label", `Количество: ${item.quantity}`);

    const plus = createActionButton("increase", product.id, "+");
    plus.setAttribute("aria-label", `Увеличить количество: ${product.title}`);
    plus.disabled = item.quantity >= MAX_QTY;

    quantity.append(minus, count, plus);

    info.append(heading, unitPrice, quantity);

    // 3. Правая часть с ценой и корзиной
    const actions = createElement("div", "cart-item__actions");

    const lineTotal = createElement(
      "strong",
      "cart-item__total-price",
      formatPrice(product.price * item.quantity),
    );

    // Кнопка удаления в виде мусорки
    const remove = createActionButton(
      "remove",
      product.id,
      "", // Текст пустой, так как будет картинка
      "button button--secondary button--icon",
    );
    remove.setAttribute("aria-label", `Удалить из корзины: ${product.title}`);
    remove.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 6h18"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;

    actions.append(lineTotal, remove);

    // Собираем карточку
    row.append(image, info, actions);
    container.append(row);
  });
}

function initCartEvents() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button || button.disabled) return;

    const action = button.dataset.action;
    const id = Number(button.dataset.productId);
    const row = cart.find((item) => item.productId === id);

    if (action === "add-to-cart") {
      addToCart(id);
      return;
    }

    if (!["remove", "increase", "decrease"].includes(action)) return;

    if (action === "remove") {
      cart = cart.filter((item) => item.productId !== id);
    } else if (action === "increase" && row && row.quantity < MAX_QTY) {
      row.quantity += 1;
    } else if (action === "decrease" && row && row.quantity > 1) {
      row.quantity -= 1;
    } else {
      return;
    }

    saveCart();
    announce(
      action === "remove" ? "Товар удалён из корзины." : "Количество изменено.",
    );
  });
}

initCartEvents();

document.addEventListener("DOMContentLoaded", () => {
  updateCartCounters();
  renderCart();
});
