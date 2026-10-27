# VeggieBoost
 
Landing page, верстка по макету из Figma. HTML, SCSS (BEM), Vite.

## Что внутри

- Адаптивная сетка: 4 колонки на мобильной и планшете, 8 на десктопе
- Мобильное меню и попап заказа на нативном `<dialog>`
- Форма заказа с проверкой полей и сообщениями об ошибках
- Бегущие ленты на CSS-анимации (учитывают `prefers-reduced-motion`)
- Семантическая разметка и доступность: ARIA-атрибуты, фокус с клавиатуры
 
## Стек

HTML5, SCSS (BEM, `@use`), JavaScript (ES-модули), Vite

## Запуск
 
```bash
npm install
npm run dev      # разработка
npm run build    # сборка в dist/
npm run preview  # посмотреть собранную версию
```
 
## Структура
 
```
src/
  assets/        шрифты и изображения
  scripts/       main.js (меню), order.js (попап заказа)
  scss/
    base/        reset, шрифты, типографика, утилиты
    utils/       переменные, миксины, extends
    layout/      page, container, header, main, footer
    components/  mobile-menu, order
    sections/    hero, order-details, how-it-works, ticker, vegetables, delivery, callback
```
