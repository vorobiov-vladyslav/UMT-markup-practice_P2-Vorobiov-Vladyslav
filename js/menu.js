"use strict";

const menu = document.getElementById("mobile-menu");
const openTriggers = document.querySelectorAll("[data-menu-open]");
const closeTriggers = menu ? menu.querySelectorAll("[data-menu-close]") : [];

function setMenuOpen(open) {
  if (!menu) return;
  menu.classList.toggle("is-open", open);
  menu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("is-menu-open", open);
  openTriggers.forEach((btn) => btn.setAttribute("aria-expanded", String(open)));
}

openTriggers.forEach((btn) => btn.addEventListener("click", () => setMenuOpen(true)));
closeTriggers.forEach((el) => el.addEventListener("click", () => setMenuOpen(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu && menu.classList.contains("is-open")) {
    setMenuOpen(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1440 && menu && menu.classList.contains("is-open")) {
    setMenuOpen(false);
  }
});
