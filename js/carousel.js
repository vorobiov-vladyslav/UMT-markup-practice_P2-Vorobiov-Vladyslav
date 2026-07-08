// Horizontal scroll carousels for the Top-Selling and Testimonials lists.
// The lists are flex scroll containers (see css); arrows page by one card and
// disable at the ends (or when every card already fits — e.g. desktop).

/** Width of one card plus the flex gap — how far a single arrow press scrolls. */
function stepSize(list) {
  const item = list.querySelector(":scope > *:not(.list-state)");
  const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
  return item ? item.getBoundingClientRect().width + gap : list.clientWidth;
}

/**
 * Wire prev/next arrows to a scrollable list.
 * @returns {() => void} refresh — recompute arrow disabled state (call after cards load).
 */
function initCarousel(list, prevBtn, nextBtn) {
  if (!list) return () => {};

  function refresh() {
    const maxScroll = list.scrollWidth - list.clientWidth;
    const fits = maxScroll <= 1;
    if (prevBtn) prevBtn.disabled = fits || list.scrollLeft <= 1;
    if (nextBtn) nextBtn.disabled = fits || list.scrollLeft >= maxScroll - 1;
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      list.scrollBy({ left: -stepSize(list), behavior: "smooth" });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      list.scrollBy({ left: stepSize(list), behavior: "smooth" });
    });
  }
  list.addEventListener("scroll", refresh, { passive: true });
  window.addEventListener("resize", refresh);
  refresh();

  return refresh;
}

/** Initialise both carousels; returns per-carousel refresh callbacks. */
export function initCarousels() {
  const top = document.querySelector(".top-selling");
  const testimonials = document.querySelector(".testimonials");

  const refreshTop = top
    ? initCarousel(top.querySelector(".top-selling__list"), ...top.querySelectorAll(".carousel-arrow"))
    : () => {};
  const refreshTestimonials = testimonials
    ? initCarousel(
        testimonials.querySelector(".testimonials__list"),
        ...testimonials.querySelectorAll(".carousel-arrow")
      )
    : () => {};

  return { refreshTop, refreshTestimonials };
}
