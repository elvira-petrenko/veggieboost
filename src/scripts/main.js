import { initOrderPopup } from './order.js';
import { initCallbackForm } from './callback.js';

// ---------- Menu mobile ----------
const burger = document.querySelector('.header__burger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeButton = document.querySelector('.mobile-menu__close');
const mobileCart = document.querySelector('.mobile-menu__cart');
const menuLinks = document.querySelectorAll('.mobile-menu__link');
const tabletQuery = window.matchMedia('(min-width: 768px)');

const isMenuOpen = () => mobileMenu.classList.contains('is-open');

const openMenu = () => {
  mobileMenu.classList.add('is-open');
  document.body.classList.add('page__body--locked');
  burger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');

  closeButton.focus();
};

const closeMenu = () => {
  burger.focus();
  
  mobileMenu.classList.remove('is-open');
  document.body.classList.remove('page__body--locked');
  burger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
};

burger.addEventListener('click', openMenu);
closeButton.addEventListener('click', closeMenu);

// клик по пункту меню закрывает его
menuLinks.forEach((link) => link.addEventListener('click', closeMenu));
mobileCart.addEventListener('click', closeMenu);

// закрытие по Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isMenuOpen()) {
    closeMenu();
  }
});

// если открытое меню растянули до планшета — закрываем, чтобы не осталась блокировка прокрутки
tabletQuery.addEventListener('change', (event) => {
  if (event.matches && isMenuOpen()) {
    closeMenu();
  }
});

// ---------- Order popup ----------
initOrderPopup();

// ---------- Callback form ----------
initCallbackForm();
