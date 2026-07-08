// Entry point: render the Top-Selling carousel and boot the Bouquets catalogue.
import { getBestsellers, getFeedbacks } from "./api.js";
import {
  renderProducts,
  renderTestimonials,
  setListState,
  clearList,
  refreshAOS,
} from "./render.js";
import { initBouquets } from "./bouquets.js";
import { initModals } from "./modal.js";
import { initOrder } from "./order.js";
import { initCarousels } from "./carousel.js";

const carousel = document.querySelector(".top-selling__list");
const testimonials = document.querySelector(".testimonials__list");
const { refreshTop, refreshTestimonials } = initCarousels();

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
    refreshTop();
  }
}

async function loadFeedbacks() {
  if (!testimonials) return;
  setListState(testimonials, "Loading feedback…");
  try {
    const items = await getFeedbacks();
    clearList(testimonials);
    renderTestimonials(testimonials, items);
  } catch (error) {
    console.error("Failed to load feedback:", error);
    setListState(testimonials, "Couldn't load feedback. Please try again later.", true);
  } finally {
    refreshAOS();
    refreshTestimonials();
  }
}

initModals();
initOrder();
loadBestsellers();
initBouquets();
loadFeedbacks();
