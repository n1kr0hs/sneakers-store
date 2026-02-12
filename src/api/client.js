import axios from "axios";

const api = axios.create({
  baseURL: "https://14ef51dbd6f2e9ea.mokky.dev",
});

export const getItems = (params) => api.get("/items", { params }).then((r) => r.data);
export const getFavorites = () => api.get("/favorites").then((r) => r.data);
export const addFavorite = (productId) =>
  api.post("/favorites", { productId }).then((r) => r.data);
export const removeFavorite = (id) => api.delete(`/favorites/${id}`);
export const createOrder = (items) => api.post("/orders", { items }).then((r) => r.data);
