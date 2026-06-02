// API adapter — the only module that talks to the backend. All access is async/await
// through one configured axios instance. Query-param mapping lives here so swapping
// provider only touches this file + config.js.
import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";
import { API_BASE_URL } from "./config.js";

const http = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

/**
 * Fetch bouquets for the catalogue grid (paginated + filterable in Block 4).
 * @param {{ page?: number, limit?: number, category?: string, featured?: boolean }} opts
 * @returns {Promise<Array>} array of bouquet records
 */
export async function getBouquets({ page, limit, category, featured } = {}) {
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (category && category !== "all") params.category = category;
  if (typeof featured === "boolean") params.featured = featured;

  const { data } = await http.get("/bouquets", { params });
  return data;
}

/** Fetch the featured bouquets shown in the Top-Selling carousel. */
export async function getBestsellers() {
  const { data } = await http.get("/bouquets", { params: { featured: true } });
  return data;
}

/** Submit an order (request form in the modal). */
export async function postOrder(order) {
  const { data } = await http.post("/orders", order);
  return data;
}
