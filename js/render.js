// Pure view layer: template strings + insertAdjacentHTML. No data fetching here.

/** id -> product lookup, populated as cards render; used to fill the details modal. */
export const productIndex = new Map();

/** Escape user-facing values before interpolating into markup. */
function esc(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
  );
}

// Two visual variants share one product template:
//  - "grid"     → Bouquets catalogue card (square 296×296, centered text, AOS)
//  - "carousel" → Top-Selling card (405×320, left-aligned text)
function productCard(b, variant) {
  const isGrid = variant === "grid";
  const w = isGrid ? 296 : 405;
  const h = isGrid ? 296 : 320;
  const infoMod = isGrid ? " product__info--center" : "";

  // No data-aos here: AOS sets [data-aos] to opacity:0 and only animates on a scroll
  // event, which it misses for nodes injected after AOS.init — they'd stay invisible.
  // The card is a button: it opens the product-details modal (mouse + keyboard).
  return `
            <li
              class="product"
              data-id="${esc(b.id)}"
              role="button"
              tabindex="0"
              aria-label="View details for ${esc(b.name)}"
            >
              <img
                class="product__image"
                src="${esc(b.image)}"
                srcset="${esc(b.image)} 1x, ${esc(b.image2x)} 2x"
                width="${w}"
                height="${h}"
                alt="${esc(b.alt)}"
              />
              <div class="product__info${infoMod}">
                <h3 class="product__name">${esc(b.name)}</h3>
                <p class="product__desc">${esc(b.description)}</p>
                <p class="product__price">$${esc(b.price)}</p>
              </div>
            </li>`;
}

/** Append product cards to a list container in one insertAdjacentHTML call. */
export function renderProducts(container, items, variant) {
  items.forEach((item) => productIndex.set(String(item.id), item));
  const html = items.map((item) => productCard(item, variant)).join("");
  container.insertAdjacentHTML("beforeend", html);
}

/** Inner markup for the product-details modal (built fresh each open). */
export function productDetailsTemplate(b) {
  return `
        <img
          class="product-details__image"
          src="${esc(b.image)}"
          srcset="${esc(b.image)} 1x, ${esc(b.image2x)} 2x"
          width="600"
          height="600"
          alt="${esc(b.alt)}"
        />
        <div class="product-details__info">
          <h2 class="product-details__name" id="product-modal-title">${esc(b.name)}</h2>
          <p class="product-details__price">$${esc(b.price)}</p>
          <p class="product-details__desc">${esc(b.description)}</p>
          <div class="product-details__actions">
            <button class="button" type="button" data-modal-open="order-modal">Buy now</button>
            <label class="product-details__qty-field">
              <span class="visually-hidden">Quantity</span>
              <input
                class="product-details__qty"
                type="number"
                name="quantity"
                value="1"
                min="1"
                max="99"
              />
            </label>
          </div>
        </div>`;
}

/** Replace a list's content with a single status message (loading / error / empty). */
export function setListState(container, message, isError = false) {
  container.innerHTML = `<li class="list-state${
    isError ? " list-state--error" : ""
  }">${esc(message)}</li>`;
}

/** Empty a list container. */
export function clearList(container) {
  container.innerHTML = "";
}

/**
 * Ask AOS to recalculate scroll-trigger offsets after the document height
 * changes (e.g. a list grew). Safe no-op if AOS isn't loaded.
 */
export function refreshAOS() {
  if (window.AOS && typeof window.AOS.refresh === "function") window.AOS.refresh();
}
