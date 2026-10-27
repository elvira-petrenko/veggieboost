// Попап заказа: открытие и закрытие, проверка полей, отправка формы.
// Вёрстка (заголовок, крестик, поля, кнопки) лежит в HTML, здесь только поведение.

const ORDER_URL = ''; // адрес сервера для заказов; пока пусто, отправка имитируется
const SUCCESS_CLOSE_DELAY = 2000;

const MESSAGES = {
  basket: 'Choose at least one basket',
  name: 'Please enter your full name',
  email: 'Please enter a valid email, for example name@example.com',
  card: 'Card number must contain 12 to 19 digits',
};

const validators = {
  name: (value) => /^[\p{L}][\p{L}\s'-]+$/u.test(value.trim()),
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()),
  card: (value) => /^\d{12,19}$/.test(value.replace(/\s/g, '')),
};

const FIELDS = Object.keys(validators);

export const initOrderPopup = () => {
  const dialog = document.querySelector(".order");

  if (!dialog) {
    return;
  }

  const form = dialog.querySelector(".order__form");
  const closeButton = dialog.querySelector(".order__close");
  const submitButton = dialog.querySelector(".order__submit");
  const status = dialog.querySelector(".order__status");
  const baskets = [...form.querySelectorAll(".order__checkbox")];
  const openButtons = document.querySelectorAll("[data-order-open]");

  let closeTimer;

  // ---------- Сообщения ----------
  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.dataset.state = isError ? "error" : "success";
  };

  const setError = (name, message) => {
    const errorElement = form.querySelector(`[data-error-for="${name}"]`);
    const input = form.elements[name];

    errorElement.textContent = message;

    if (input instanceof HTMLElement) {
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }
  };

 const clearErrors = () => {
    [...FIELDS, "basket"].forEach((name) => setError(name, ""));
  };

  // ---------- Открытие и закрытие ----------
  const openDialog = () => {
    setStatus("");
    dialog.showModal(); // фокус, Esc и затемнение фона делает сам <dialog>
    document.body.classList.add("page__body--locked");
  };

  const closeDialog = () => dialog.close();

  openButtons.forEach((button) => button.addEventListener("click", openDialog));
  closeButton.addEventListener("click", closeDialog);

  // клик по затемнённому фону или по свободному месту вокруг окна
  dialog.addEventListener("click", (event) => {
    if (!event.target.closest(".order__window")) {
      closeDialog();
    }
  });

  // срабатывает при любом закрытии: крестик, фон, Esc, успешная отправка
  dialog.addEventListener("close", () => {
    document.body.classList.remove("page__body--locked");
    clearTimeout(closeTimer);
    clearErrors();
  });

  // ---------- Проверка ----------
  const validateField = (name) => {
    const isValid = validators[name](form.elements[name].value);

    setError(name, isValid ? "" : MESSAGES[name]);

    return isValid;
  };

  const validateBaskets = () => {
    const isValid = baskets.some((basket) => basket.checked);

    setError("basket", isValid ? "" : MESSAGES.basket);

    return isValid;
  };

  const validateForm = () => {
    const checks = [
      [validateBaskets(), baskets[0]],
      ...FIELDS.map((name) => [validateField(name), form.elements[name]]),
    ];
    const firstInvalid = checks.find(([isValid]) => !isValid);

    // фокус на первое неверное поле
    firstInvalid?.[1].focus();

    return !firstInvalid;
  };

  // после ошибки поле перепроверяется сразу, пока человек исправляет
  FIELDS.forEach((name) => {
    form.elements[name].addEventListener("input", () => {
      if (form.elements[name].getAttribute("aria-invalid") === "true") {
        validateField(name);
      }
    });
  });

  baskets.forEach((basket) => {
    basket.addEventListener("change", () => {
      if (form.querySelector('[data-error-for="basket"]').textContent) {
        validateBaskets();
      }
    });
  });

  // номер карты группируется по 4 цифры
  form.elements.card.addEventListener("input", (event) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 19);

    event.target.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  });

  // ---------- Отправка ----------
  const collectOrder = () => {
    const data = new FormData(form);
    const cardDigits = String(data.get("card")).replace(/\s/g, "");

    return {
      baskets: data.getAll("basket"),
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      cardLast4: cardDigits.slice(-4), // полный номер карты никуда не отправляем
      comments: String(data.get("comments")).trim(),
    };
  };

  const sendOrder = async (order) => {
    if (!ORDER_URL) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      return;
    }

    const response = await fetch(ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("");
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      await sendOrder(collectOrder());

      form.reset();
      setStatus("Thank you! Your order has been placed.");
      closeTimer = setTimeout(closeDialog, SUCCESS_CLOSE_DELAY);
    } catch {
      setStatus("Something went wrong. Please try again.", true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  });
};;