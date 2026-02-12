<script setup>
import { inject, onMounted, reactive, ref, watch } from "vue";
import {
  addFavorite,
  getFavorites,
  getItems,
  removeFavorite,
} from "@/api/client";
import { CardList } from "@/components";

const items = ref([]);
const filters = reactive({ sortBy: "title", searchQuery: "" });

const { cartItems, toggleCartItem } = inject("cartContext");

const updateItem = (id, payload) => {
  items.value = items.value.map((p) =>
    p.id === id ? { ...p, ...payload } : p
  );
};

const fetchItems = async () => {
  try {
    const params = { sortBy: filters.sortBy };
    if (filters.searchQuery) params.title = `*${filters.searchQuery}*`;
    const data = await getItems(params);
    items.value = data.map((p) => ({
      ...p,
      imageUrl: p.imageUrl?.startsWith("/") ? p.imageUrl : `/${p.imageUrl}`,
      isFavorite: false,
      favoriteId: null,
      isAdded: cartItems.value.some((c) => c.id === p.id),
    }));
  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
  }
};

const fetchFavorites = async () => {
  try {
    const favorites = await getFavorites();
    const favMap = new Map(favorites.map((f) => [f.productId, f]));
    items.value = items.value.map((p) => {
      const fav = favMap.get(p.id);
      return fav
        ? { ...p, isFavorite: true, favoriteId: fav.id }
        : { ...p, isFavorite: false, favoriteId: null };
    });
  } catch (err) {
    console.error("Ошибка загрузки избранного:", err);
  }
};

const addToCart = (item) => {
  toggleCartItem(item);
  updateItem(item.id, {
    isAdded: cartItems.value.some((c) => c.id === item.id),
  });
};

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const data = await addFavorite(item.id);
      updateItem(item.id, { isFavorite: true, favoriteId: data.id });
    } else if (item.favoriteId) {
      await removeFavorite(item.favoriteId);
      updateItem(item.id, { isFavorite: false, favoriteId: null });
    }
  } catch (err) {
    console.error("Ошибка обновления избранного:", err);
  }
};

watch(
  filters,
  async () => {
    await fetchItems();
    await fetchFavorites();
  },
  { deep: true }
);

watch(
  cartItems,
  (val) => {
    items.value = items.value.map((p) => ({
      ...p,
      isAdded: val.some((c) => c.id === p.id),
    }));
  },
  { deep: true }
);

onMounted(async () => {
  await fetchItems();
  await fetchFavorites();
});
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
    >
      <h2
        class="text-2xl sm:text-3xl font-bold animate-fade-in"
      >
        Все кроссовки
      </h2>
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <select
          v-model="filters.sortBy"
          class="py-2 px-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-lime-400 transition-all"
          aria-label="Сортировка"
        >
          <option value="title">По названию</option>
          <option value="price">По цене (дешевые)</option>
          <option value="-price">По цене (дорогие)</option>
        </select>
        <div class="relative">
          <img
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50"
            src="/search.svg"
            alt=""
          />
          <input
            v-model="filters.searchQuery"
            class="w-full sm:w-48 border border-gray-200 rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-lime-400 transition-all"
            placeholder="Поиск..."
            type="text"
            aria-label="Поиск"
          />
        </div>
      </div>
    </div>
    <CardList
      :items="items"
      @add-to-favorite="addToFavorite"
      @add-to-cart="addToCart"
    />
  </div>
</template>
