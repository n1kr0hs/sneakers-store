<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import debounce from "lodash.debounce";
import { getItems } from "@/api/client";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { CardList } from "@/components";

const items = ref([]);
const filters = reactive({ sortBy: "title", searchQuery: "" });
const debouncedSearchQuery = ref("");

const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();

const updateItem = (id, payload) => {
  items.value = items.value.map((p) =>
    p.id === id ? { ...p, ...payload } : p,
  );
};

const fetchItems = async () => {
  try {
    const params = { sortBy: filters.sortBy };
    if (debouncedSearchQuery.value) {
      params.title = `*${debouncedSearchQuery.value}*`;
    }
    const data = await getItems(params);
    items.value = data.map((p) => ({
      ...p,
      imageUrl: p.imageUrl || "",
      isFavorite: favoritesStore.isFavorite(p.id),
      favoriteId: favoritesStore.getFavoriteId(p.id) || null,
      isAdded: cartStore.items.some((c) => c.id === p.id),
    }));
  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
  }
};

const fetchFavorites = async () => {
  try {
    await favoritesStore.fetchFavorites();
    items.value = items.value.map((p) => ({
      ...p,
      isFavorite: favoritesStore.isFavorite(p.id),
      favoriteId: favoritesStore.getFavoriteId(p.id) || null,
    }));
  } catch (err) {
    console.error("Ошибка загрузки избранного:", err);
  }
};

const addToCart = (item) => {
  cartStore.toggleCartItem(item);
  updateItem(item.id, {
    isAdded: cartStore.items.some((c) => c.id === item.id),
  });
};

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const data = await favoritesStore.addFavorite(item.id);
      updateItem(item.id, { isFavorite: true, favoriteId: data.id });
    } else {
      await favoritesStore.removeFavorite(item.id);
      updateItem(item.id, { isFavorite: false, favoriteId: null });
    }
  } catch (err) {
    console.error("Ошибка обновления избранного:", err);
  }
};

const updateDebouncedSearch = debounce((value) => {
  debouncedSearchQuery.value = value;
}, 300);

watch(
  () => filters.searchQuery,
  (newValue) => {
    updateDebouncedSearch(newValue);
  },
);

watch(debouncedSearchQuery, async () => {
  await fetchItems();
  await fetchFavorites();
});

watch(
  () => filters.sortBy,
  async () => {
    await fetchItems();
    await fetchFavorites();
  },
);

watch(
  () => cartStore.items,
  () => {
    items.value = items.value.map((p) => ({
      ...p,
      isAdded: cartStore.items.some((c) => c.id === p.id),
    }));
  },
  { deep: true },
);

onMounted(async () => {
  debouncedSearchQuery.value = filters.searchQuery;
  await favoritesStore.fetchFavorites();
  await fetchItems();
});
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
    >
      <h2 class="text-2xl sm:text-3xl font-bold animate-fade-in">
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
