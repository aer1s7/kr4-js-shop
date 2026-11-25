const orderForm = document.querySelector(".order-form");

if (orderForm) {
  const productInput = orderForm.querySelector("#order-product");
  const topicSelect = orderForm.querySelector("#order-topic");
  const nameInput = orderForm.querySelector("#order-name");
  const emailInput = orderForm.querySelector("#order-email");
  const phoneInput = orderForm.querySelector("#order-phone");
  const commentInput = orderForm.querySelector("#order-comment");
  const agreementCheck = orderForm.querySelector("#order-agreement");

  const productError = orderForm.querySelector("#order-product-error");
  const topicError = orderForm.querySelector("#order-topic-error");
  const nameError = orderForm.querySelector("#order-name-error");
  const emailError = orderForm.querySelector("#order-email-error");
  const phoneError = orderForm.querySelector("#order-phone-error");
  const commentError = orderForm.querySelector("#order-comment-error");
  const agreementError = orderForm.querySelector("#order-agreement-error");

  const formMessage = orderForm.querySelector(".form-message");

  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", errorElement.id);
  }

  function clearError(input, errorElement) {
    errorElement.textContent = "";
    input.removeAttribute("aria-invalid");
  }

  function validateProduct() {
    const value = productInput.value.trim();

    if (value.length < 6) {
      showError(
        productInput,
        productError,
        "Введите название товара не короче 6 символов.",
      );
      return false;
    }

    clearError(productInput, productError);
    return true;
  }

  function validateTopic() {
    const value = topicSelect.value.trim();

    if (value === "default") {
      showError(topicSelect, topicError, "Выберите тему заявки.");
      return false;
    }

    clearError(topicSelect, topicError);
    return true;
  }

  function validateName() {
    const value = nameInput.value.trim();

    if (value.length < 2) {
      showError(nameInput, nameError, "Введите имя не короче 2 символов.");
      return false;
    }

    clearError(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, "Введите корректный e-mail.");
      return false;
    }

    clearError(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    const digits = value.replace(/\D/g, "");

    if (digits.length !== 11 || !["7", "8"].includes(digits[0])) {
      showError(phoneInput, phoneError, "Введите корректный номер телефона.");
      return false;
    }

    clearError(phoneInput, phoneError);
    return true;
  }

  function validateComment() {
    const value = commentInput.value.trim();

    if (value.length < 15) {
      showError(
        commentInput,
        commentError,
        "Введите комментарий не короче 15 символов.",
      );
      return false;
    }

    clearError(commentInput, commentError);
    return true;
  }

  function validateAgreement() {
    const value = agreementCheck.checked;

    if (!value) {
      showError(
        agreementCheck,
        agreementError,
        "Для отправки формы требуется согласие на обработку персональных данных.",
      );
      return false;
    }

    clearError(agreementCheck, agreementError);
    return true;
  }

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isProductValid = validateProduct();
    const isTopicValid = validateTopic();
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isCommentValid = validateComment();
    const isAgreementValid = validateAgreement();

    const isFormValid =
      isProductValid &&
      isTopicValid &&
      isNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isCommentValid &&
      isAgreementValid;

    if (!isFormValid) {
      formMessage.textContent = "Проверьте поля формы.";
      return;
    }

    const requestData = {
      product: productInput.value.trim(),
      topic: topicSelect.value.trim(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      comment: commentInput.value.trim(),
      agreement: agreementCheck.checked,
    };

    console.log("Форма прошла учебную проверку; данные не отправлены.");

    formMessage.textContent =
      "Форма прошла учебную проверку. Данные не отправлены.";
    orderForm.reset();
  });

  productInput.addEventListener("input", validateProduct);
  topicSelect.addEventListener("change", validateTopic);
  nameInput.addEventListener("input", validateName);
  emailInput.addEventListener("input", validateEmail);
  phoneInput.addEventListener("input", validatePhone);
  commentInput.addEventListener("input", validateComment);
  agreementCheck.addEventListener("change", validateAgreement);
}
