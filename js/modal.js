// Generic modal engine — open/close via the `is-open` class, with backdrop + Esc
// close, body scroll lock, and a focus trap. Shared by all modals on the page.
const SCROLL_LOCK = "is-modal-open";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let activeModal = null;
let lastTrigger = null;

function focusables(modal) {
  return [...modal.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
}

export function openModal(id, trigger) {
  const modal = document.getElementById(id);
  if (!modal) return;
  if (activeModal && activeModal !== modal) hide(activeModal);

  lastTrigger = trigger || document.activeElement;
  modal.classList.add("is-open");
  document.body.classList.add(SCROLL_LOCK);
  activeModal = modal;

  // Force a style/layout flush so visibility:visible applies now — a visibility:hidden
  // element isn't focusable, so without this the focus() below would silently no-op.
  void modal.offsetWidth;
  const targets = focusables(modal);
  (targets[0] || modal.querySelector(".modal__dialog")).focus();
}

export function closeModal() {
  if (!activeModal) return;
  const trigger = lastTrigger;
  hide(activeModal);
  activeModal = null;
  lastTrigger = null;
  if (trigger && typeof trigger.focus === "function" && trigger.isConnected) trigger.focus();
}

function hide(modal) {
  modal.classList.remove("is-open");
  document.body.classList.remove(SCROLL_LOCK);
}

function onKeydown(event) {
  if (!activeModal) return;
  if (event.key === "Escape") {
    closeModal();
    return;
  }
  if (event.key !== "Tab") return;

  const targets = focusables(activeModal);
  if (targets.length === 0) return;
  const first = targets[0];
  const last = targets[targets.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function initModals() {
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-modal-open]");
    if (opener) {
      openModal(opener.dataset.modalOpen, opener);
      return;
    }
    if (event.target.closest("[data-modal-close]") && activeModal) closeModal();
  });
  document.addEventListener("keydown", onKeydown);
}
