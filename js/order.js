// Block 2 behaviour: open the product-details modal from a card, and handle the
// order form (validation + submit to the API).
import { openModal, closeModal } from "./modal.js";
import { productIndex, productDetailsTemplate } from "./render.js";
import { postOrder } from "./api.js";

const productModal = document.getElementById("product-modal");
const orderForm = document.querySelector(".order-form");
const toast = document.getElementById("order-toast");

let selectedProduct = null;
let toastTimer = null;

function showToast() {
  if (!toast) return;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4000);
}

function openProductDetails(card) {
  const product = productIndex.get(String(card.dataset.id));
  if (!product) return;
  selectedProduct = product;
  productModal.querySelector(".product-details").innerHTML = productDetailsTemplate(product);
  openModal("product-modal", card);
}

function onListActivate(event) {
  const card = event.target.closest(".product");
  if (!card || !card.dataset.id) return;
  // Activate on click, or Enter/Space when the card has keyboard focus.
  if (event.type === "keydown") {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
  }
  openProductDetails(card);
}

async function onOrderSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector(".order-form__status");
  const submit = form.querySelector('[type="submit"]');

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const order = {
    name: data.get("name"),
    phone: data.get("phone"),
    address: data.get("address"),
    message: data.get("message"),
    agree: data.get("agree") === "on",
    product: selectedProduct ? selectedProduct.name : null,
    quantity: Number(productModal.querySelector(".product-details__qty")?.value) || 1,
  };

  const defaultLabel = submit.textContent;
  submit.disabled = true;
  submit.textContent = "Sending…";
  status.textContent = "";
  try {
    await postOrder(order);
    form.reset();
    closeModal();
    showToast();
  } catch (error) {
    console.error("Order submit failed:", error);
    status.textContent = "Something went wrong. Please try again.";
  } finally {
    submit.disabled = false;
    submit.textContent = defaultLabel;
  }
}

export function initOrder() {
  [".top-selling__list", ".bouquets__grid"].forEach((selector) => {
    const list = document.querySelector(selector);
    if (!list) return;
    list.addEventListener("click", onListActivate);
    list.addEventListener("keydown", onListActivate);
  });

  if (orderForm) orderForm.addEventListener("submit", onOrderSubmit);
}
