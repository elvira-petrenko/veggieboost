# VeggieBoost

A responsive landing page for a fresh vegetable delivery shop, built from a Figma design with HTML, SCSS (BEM) and vanilla JavaScript.

**[View live demo](https://elvira-petrenko.github.io/veggieboost/)**

## Features

- Responsive layout: 4-column grid on mobile and tablet, 8-column grid on desktop
- Mobile menu and order popup built on the native `<dialog>` element
- Order form and callback form with field validation and error messages
- CSS-only marquee tickers that respect `prefers-reduced-motion`
- Semantic HTML and accessibility: ARIA attributes, visible keyboard focus

## Tech stack

HTML5, SCSS (BEM, HTML, Smodules), JavaScript (ES modules), Vite

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```
## Proeject structure 

```
src/
  assets/        fonts and images
  scripts/       main.js (menu), order.js (order popup), callback.js (callback form)
  scss/
    base/        reset, fonts, typography, utilities
    utils/       variables, mixins, extends
    layout/      page, container, header, main, footer
    components/  mobile-menu, order
    sections/    hero, order-details, how-it-works, ticker, vegetables, delivery, callback
```

## Author

Elvira Petrenko · [GitHub](https://github.com/elvira-petrenko)
