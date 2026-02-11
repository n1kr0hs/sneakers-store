<script setup>
import { inject, onMounted, reactive, ref, watch } from "vue";
import axios from "axios";
import { CardList } from "@/components";

const API_BASE = "https://14ef51dbd6f2e9ea.mokky.dev";

const items = ref([]);

const filters = reactive({
  sortBy: "title",
  searchQuery: "",
});

const cartContext = inject("cartContext");
if (!cartContext) {
  throw new Error("cartContext is not provided");
}

const { cartItems, toggleCartItem } = cartContext;

const updateItemState = (id, payload) => {
  items.value = items.value.map((product) =>
    product.id === id ? { ...product, ...payload } : product,
  );
};

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`${API_BASE}/favorites`);
    const favoriteMap = new Map(
      favorites.map((favorite) => [favorite.productId, favorite]),
    );

    items.value = items.value.map((product) => {
      const favorite = favoriteMap.get(product.id);
      if (!favorite) {
        return { ...product, isFavorite: false, favoriteId: null };
      }

      return {
        ...product,
        isFavorite: true,
        favoriteId: favorite.id,
      };
    });
  } catch (err) {
    console.error("Ошибка загрузки избранного:", err);
  }
};

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
    };

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`;
    }

    const { data } = await axios.get(`${API_BASE}/items`, { params });
    items.value = data.map((product) => ({
      ...product,
      isFavorite: false,
      favoriteId: null,
      isAdded: cartItems.value.some((cartItem) => cartItem.id === product.id),
    }));
  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
  }
};

const addToCart = (item) => {
  toggleCartItem(item);
  const isInCart = cartItems.value.some((cartItem) => cartItem.id === item.id);
  updateItemState(item.id, { isAdded: isInCart });
};

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const { data } = await axios.post(`${API_BASE}/favorites`, {
        productId: item.id,
      });
      updateItemState(item.id, { isFavorite: true, favoriteId: data.id });
    } else if (item.favoriteId) {
      await axios.delete(`${API_BASE}/favorites/${item.favoriteId}`);
      updateItemState(item.id, { isFavorite: false, favoriteId: null });
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
  { deep: true },
);

watch(
  cartItems,
  (value) => {
    items.value = items.value.map((product) => ({
      ...product,
      isAdded: value.some((cartItem) => cartItem.id === product.id),
    }));
  },
  { deep: true },
);

onMounted(async () => {
  await fetchItems();
  await fetchFavorites();
});
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

    <div class="flex gap-4">
      <select
        v-model="filters.sortBy"
        class="py-2 px-3 border border-gray-200 rounded-md outline-none"
        aria-label="Сортировка"
      >
        <option value="title">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (Дорогие)</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" alt="Search" />
        <input
          v-model="filters.searchQuery"
          class="border border-gray-200 rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
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
</template>
