// Block 4 — the Bouquets catalogue: paginated "Show More" + category filtering,
// driven by one state object (the single source of truth).
import { getBouquets } from "./api.js";
import { PAGE_LIMIT } from "./config.js";
import { renderProducts, setListState, refreshAOS } from "./render.js";

const grid = document.querySelector(".bouquets__grid");
const loadMoreBtn = document.querySelector(".bouquets__more");
const filterGroup = document.querySelector(".bouquets__filters");

// Single source of truth for the catalogue list.
const state = {
  page: 1,
  limit: PAGE_LIMIT,
  category: "all", // "all" => no category param
  hasMore: false,
  loading: false,
};

function showLoadMore(visible) {
  if (loadMoreBtn) loadMoreBtn.hidden = !visible;
}

function setLoadMoreBusy(busy) {
  if (loadMoreBtn) loadMoreBtn.textContent = busy ? "Loading…" : "Show More";
}

// The catalogue grid always excludes bestsellers (featured:true live in Top-Selling).
function fetchCurrentPage() {
  return getBouquets({
    page: state.page,
    limit: state.limit,
    category: state.category,
    featured: false,
  });
}

// Fresh load — initial render or after a filter change: reset to page 1, replace the grid.
async function loadFirstPage() {
  state.loading = true;
  state.page = 1;
  showLoadMore(false);
  setListState(grid, "Loading bouquets…");

  try {
    const items = await fetchCurrentPage();
    if (items.length === 0) {
      setListState(grid, "No bouquets match this filter.");
      state.hasMore = false;
      return;
    }
    grid.innerHTML = "";
    renderProducts(grid, items, "grid");
    state.hasMore = items.length === state.limit;
    showLoadMore(state.hasMore);
  } catch (error) {
    console.error("Failed to load bouquets:", error);
    setListState(grid, "Couldn't load bouquets. Please try again later.", true);
    state.hasMore = false;
  } finally {
    state.loading = false;
    refreshAOS();
  }
}

// Append the next page; existing cards stay untouched, so no duplicates.
async function loadMore() {
  if (state.loading || !state.hasMore) return;
  state.loading = true;
  setLoadMoreBusy(true);
  state.page += 1;

  try {
    const items = await fetchCurrentPage();
    renderProducts(grid, items, "grid");
    state.hasMore = items.length === state.limit;
    showLoadMore(state.hasMore);
  } catch (error) {
    console.error("Failed to load more bouquets:", error);
    state.page -= 1; // roll back so the next click retries the same page
  } finally {
    state.loading = false;
    setLoadMoreBusy(false);
    refreshAOS();
  }
}

// Changing the filter resets pagination and reloads from page 1.
function selectCategory(category) {
  if (state.loading || category === state.category) return;
  state.category = category;
  filterGroup.querySelectorAll(".chip").forEach((chip) => {
    const active = chip.dataset.category === category;
    chip.classList.toggle("chip--active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
  loadFirstPage();
}

export function initBouquets() {
  if (!grid) return;
  if (loadMoreBtn) loadMoreBtn.addEventListener("click", loadMore);
  if (filterGroup) {
    filterGroup.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (chip) selectCategory(chip.dataset.category);
    });
  }
  loadFirstPage();
}
