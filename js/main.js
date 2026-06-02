// Entry point: render the Top-Selling carousel and boot the Bouquets catalogue.
import { getBestsellers } from "./api.js";
import { renderProducts, setListState, clearList, refreshAOS } from "./render.js";
import { initBouquets } from "./bouquets.js";
import { initModals } from "./modal.js";
import { initOrder } from "./order.js";

const carousel = document.querySelector(".top-selling__list");

async function loadBestsellers() {
  if (!carousel) return;
  setListState(carousel, "Loading bestsellers…");
  try {
    const items = await getBestsellers();
    clearList(carousel);
    renderProducts(carousel, items, "carousel");
  } catch (error) {
    console.error("Failed to load bestsellers:", error);
    setListState(carousel, "Couldn't load bestsellers. Please try again later.", true);
  } finally {
    refreshAOS();
  }
}

initModals();
initOrder();
loadBestsellers();
initBouquets();
