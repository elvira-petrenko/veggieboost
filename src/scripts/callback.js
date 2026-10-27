// ------- Форма обратного звонка ---------
const CALLBACK_URL = '';

const MESSAGES = {
  empty: 'Please enter your phone number',
  invalid: 'Please enter a valid phone number, for example +380 68 443 94 26',
};

const PHONE_PATTERN = /^\+?[\d\s()-]+$/;
const MIN_DIGITS = 10;
const MAX_DIGITS = 15;

const getPhoneError = (value) => {
  const phone = value.trim();
  const digits = phone.replace(/\D/g, '');

  if (!phone) {
    return MESSAGES.empty;
  }

  if (!PHONE_PATTERN.test(phone) || digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) {
    return MESSAGES.invalid;
  }

  return '';
};
export const initCallbackForm = () => {
  const form = document.querySelector('.callback__form');

  if (!form) {
    return;
  }

  const input = form.elements.phone;
  const submitButton = form.querySelector('.callback__button');
  const status = document.querySelector('.callback__status');

  // -------------- Сообщение ------------
  const showMessage = (message, state) => {
    status.textContent = message;
    status.dataset.state = state; //success или eror, от него зависит цвет
  };

  // ----------- Проверка -----------
  const validate = () => {
    const error = getPhoneError(input.value);

    input.setAttribute('aria-invalid', error ? 'true' : 'false');
    showMessage(error, 'error');

    return !error;
  };

  // ----------- Проверка поля сразу после ошибки --------
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') {
      validate();
    }
  });

  // ----------- Отправка -----------------
  const sendCallback = async (phone) => {
    if (!CALLBACK_URL) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      return;
    }

    const response = await fetch(CALLBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validate()) {
      input.focus();

      return;
    }

    showMessage('', 'success');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      await sendCallback(input.value.trim());

      form.reset();
      showMessage('Thank you! We will call you back soon.', 'success');
    } catch {
      showMessage('Something went wrong. Plaese try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Recall';
    }
  });
};
