# Flora

Responsive flower-shop landing page built to match the Flora Figma design, with an
interactive client-side layer (retina graphics, modals, and a data-driven catalogue).

**Live:** https://vorobiov-vladyslav.github.io/UMT-markup-practice_P2-Vorobiov-Vladyslav/

## What's inside

**Static layer**

- Semantic HTML with 6 sections: hero, about, top-selling bouquets, bouquets grid, testimonials, contact
- Mobile-first CSS with three breakpoints: **375 / 768 / 1440**
- SVG sprite (`images/icons.svg`) referenced via `<use href="...#icon-name">`
- Mobile burger menu (vanilla JS, opens via `is-open` class, closes on Esc / resize to desktop)
- AOS scroll animations via CDN
- Google Fonts: Hanuman (headings) + Roboto (body)
- W3C-valid HTML and CSS

**Interactive layer**

- **Retina images** — every content `<img>` has a `1x / 2x` `srcset`; the hero background
  swaps to `@2x` via `@media (min-resolution: 2dppx)`.
- **Modals & forms** — a product-details modal and an order modal share one engine
  (backdrop, `is-open` class, close on button / backdrop / `Esc`, body scroll lock, focus
  trap). The order form is validated and includes a custom SVG-sprite checkbox.
- **Data-driven lists** — Top-Selling and Bouquets are rendered from an API with `axios` +
  `async/await` and `insertAdjacentHTML` (no static card markup).
- **Pagination & filtering** — the Bouquets grid loads in pages via "Show More" and filters
  by category chips, driven by one state object; changing a filter resets to page 1.
- On a successful order the modal closes and a top-right success toast appears.

## Data / API

The frontend talks to a hosted **mockapi.io** project through a single adapter, so the
backend is swappable in one place.

- `js/config.js` — `API_BASE_URL` and `PAGE_LIMIT` (the only place to change the provider).
- `js/api.js` — the axios adapter (`getBouquets`, `getBestsellers`, `postOrder`).
- `db.json` — the data seed (11 bouquets) that mirrors the API; also usable with a local
  `json-server` and as a reference for the data shape.

Endpoints used: `GET /bouquets?page=&limit=&category=&featured=`, `POST /orders`.
Top-Selling = `featured:true`; the Bouquets catalogue = `featured:false`.

To run against a **local json-server** instead of the hosted API:

```bash
npx json-server --watch db.json --port 3000
# then set API_BASE_URL in js/config.js to http://localhost:3000
```

## Structure

```
index.html
css/styles.css
js/
  config.js     # API base URL + page size
  api.js        # axios adapter (the backend boundary)
  render.js     # template strings + insertAdjacentHTML; product registry
  bouquets.js   # catalogue state: pagination + category filtering
  modal.js      # generic modal engine (is-open, focus trap, scroll lock)
  order.js      # product details + order form + success toast
  main.js       # entry point
  menu.js       # mobile burger menu
images/         # photos (+ @2x retina variants), logos, icons.svg sprite, favicon.svg
db.json         # bouquet data seed / json-server source
```

## Run locally

Any static server works (the app uses ES modules, so it must be served over HTTP, not
opened as a `file://`). From the project root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Validate

HTML:
```bash
curl -s -H "Content-Type: text/html; charset=utf-8" \
  --data-binary @index.html "https://validator.w3.org/nu/?out=json"
```

CSS:
```bash
curl -s -F "file=@css/styles.css;type=text/css" -F "profile=css3svg" -F "output=json" \
  "https://jigsaw.w3.org/css-validator/validator"
```
</content>
