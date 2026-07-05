// API adapter — the only module that talks to the backend. All access is async/await
// through one configured axios instance. Provider-specific field/param mapping lives here,
// so swapping backend only touches this file + config.js. The Flora API uses
// title/photoURL/favorite; the view layer uses name/image/featured — bridged in normalize().
import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";
import { API_BASE_URL } from "./config.js";

// 60s timeout tolerates Render free-tier cold starts (the service spins down when idle).
const http = axios.create({ baseURL: API_BASE_URL, timeout: 60000 });

// Map an API record (title/photoURL/favorite) to the shape the view layer expects.
function normalize(bouquet) {
  return {
    ...bouquet,
    name: bouquet.title,
    image: bouquet.photoURL,
    featured: bouquet.favorite,
  };
}

/**
 * Fetch bouquets for the catalogue grid (paginated + filterable).
 * @param {{ page?: number, limit?: number, category?: string, featured?: boolean }} opts
 * @returns {Promise<Array>} array of bouquet records
 */
export async function getBouquets({ page, limit, category, featured } = {}) {
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (category && category !== "all") params.category = category;
  if (typeof featured === "boolean") params.favorite = featured;

  const { data } = await http.get("/bouquets", { params });
  return data.map(normalize);
}

/** Fetch the featured bouquets shown in the Top-Selling carousel. */
export async function getBestsellers() {
  const { data } = await http.get("/bouquets", { params: { favorite: true } });
  return data.map(normalize);
}

/** Submit an order (request form in the modal). */
export async function postOrder(order) {
  const { data } = await http.post("/orders", order);
  return data;
}

/** Fetch client feedbacks shown in the "What our clients says" section. */
export async function getFeedbacks() {
  const { data } = await http.get("/feedbacks");
  return data;
}
