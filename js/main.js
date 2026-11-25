// Получаем модальное окно по id.
const orderDialog = document.getElementById("order-dialog");
// Получаем все кнопки заказа в карточках товаров.
const orderButtons = document.querySelectorAll(".product-card__button");
// Получаем кнопку закрытия модального окна.
const closeDialogButton = document.getElementById("close-order-dialog");
// Получаем скрытое поле, в которое будет записан выбранный товар.
const selectedProductInput = document.getElementById("selected-product");
// Перебираем все кнопки «Заказать».
orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Получаем название товара из data-атрибута.
    const productName = button.dataset.product;
    // Записываем название товара в скрытое поле формы.
    selectedProductInput.value = productName;
    // Открываем модальное окно.
    orderDialog.showModal();
  });
});
// Закрываем модальное окно по кнопке «Закрыть».
closeDialogButton.addEventListener("click", () => {
  orderDialog.close();
});

// Получаем форму заявки.
const orderForm = document.getElementById("order-form");
// Получаем сообщение об успешной отправке.
const successMessage = document.getElementById("success-message");
// Обрабатываем отправку формы.
orderForm.addEventListener("submit", (event) => {
  // Отменяем стандартную отправку формы,
  // потому что backend пока не подключён.
  event.preventDefault();
  // Сбрасываем предыдущие признаки ошибок.
  const formElements = Array.from(orderForm.elements);
  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute("aria-invalid");
    }
  });
  // Проверяем встроенные HTML-ограничения формы.
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute("aria-invalid", "true");
      }
    });
    // Показываем стандартные сообщения браузера.
    orderForm.reportValidity();
    return;
  }
  // Показываем сообщение об успешной отправке.
  successMessage.hidden = false;
  // Очищаем форму.
  orderForm.reset();
  // Закрываем модальное окно.
  orderDialog.close();
});

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

function sortProductsByPrice(products, direction = "asc") {
  const productsCopy = [...products];

  if (direction === "desc") {
    return productsCopy.sort((a, b) => b.price - a.price);
  }

  return productsCopy.sort((a, b) => a.price - b.price);
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

function getPreparedProducts(products, query, category, sortDirection) {
  let result = [...products];

  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);

  return result;
}

const productTitles = getProductTitles(products);
const availableProducts = getAvailableProducts(products);
const searchResult = searchProducts(products, "наушники");
const keyboardsProducts = filterProductsByCategory(products, "keyboards");
const productsSortedByPrice = sortProductsByPrice(products, "asc");
const selectedProduct = findProductById(products, 3);
const totalPrice = calculateTotalPrice(products);
const availableCount = countAvailableProducts(products);
const averagePrice = calculateAveragePrice(products);
const preparedProducts = getPreparedProducts(products, "Ma", "laptops", "asc");

console.log(preparedProducts);
