import { defineStore } from "pinia";
import { ref } from "vue";
import {
  addFavorite as apiAddFavorite,
  getFavorites as apiGetFavorites,
  removeFavorite as apiRemoveFavorite,
} from "@/api/client";
import { useCartStore } from "./cart";

export const useFavoritesStore = defineStore("favorites", () => {
  const favoriteIds = ref(new Set()); // Set для быстрого поиска
  const favoriteMap = ref(new Map()); // Map для хранения favoriteId по productId

  const cartStore = useCartStore();

  const isFavorite = (productId) => favoriteIds.value.has(productId);

  const getFavoriteId = (productId) => favoriteMap.value.get(productId);

  const addFavorite = async (productId) => {
    try {
      const data = await apiAddFavorite(productId);
      favoriteIds.value.add(productId);
      favoriteMap.value.set(productId, data.id);
      return data;
    } catch (err) {
      console.error("Ошибка добавления в избранное:", err);
      throw err;
    }
  };

  const removeFavorite = async (productId) => {
    try {
      const favoriteId = favoriteMap.value.get(productId);
      if (favoriteId) {
        await apiRemoveFavorite(favoriteId);
        favoriteIds.value.delete(productId);
        favoriteMap.value.delete(productId);
      }
    } catch (err) {
      console.error("Ошибка удаления из избранного:", err);
      throw err;
    }
  };

  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      await removeFavorite(productId);
    } else {
      await addFavorite(productId);
    }
  };

  const fetchFavorites = async () => {
    try {
      const favorites = await apiGetFavorites();
      favoriteIds.value.clear();
      favoriteMap.value.clear();
      favorites.forEach((fav) => {
        favoriteIds.value.add(fav.productId);
        favoriteMap.value.set(fav.productId, fav.id);
      });
    } catch (err) {
      console.error("Ошибка загрузки избранного:", err);
      throw err;
    }
  };

  // Проверка, добавлен ли товар в корзину
  const isAddedToCart = (productId) => {
    return cartStore.items.some((item) => item.id === productId);
  };

  return {
    favoriteIds,
    favoriteMap,
    isFavorite,
    getFavoriteId,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    fetchFavorites,
    isAddedToCart,
  };
});
