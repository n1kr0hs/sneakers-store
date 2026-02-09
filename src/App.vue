<!--SFC - Single File Component - в одном файле логика, верстка, стилизация-->
<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import axios from "axios";
import { CardList, Drawer, TheHeader } from "./components";

const API_BASE = "https://14ef51dbd6f2e9ea.mokky.dev";

const isDrawerOpen = ref(false);
const items = ref([]);
const cartItems = ref([]);

const filters = reactive({
  sortBy: "title",
  searchQuery: "",
});

const openDrawer = () => {
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + (item.price || 0), 0),
);

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`${API_BASE}/favorites`);
    items.value = items.value.map((item) => {
      const favorite = favorites.find(
        (favorite) => favorite.productId === item.id,
      );

      if (!favorite) {
        return item;
      }

      return { ...item, isFavorite: true, favoriteId: favorite.id };
    });
  } catch (err) {
    console.error("Ошибка загрузки избранного:", err);
  }
};

const createOrder = async () => {
  try {
    const { data } = await axios.post(`${API_BASE}/orders`, {
      items: cartItems.value,
    });
    cartItems.value = [];
    items.value = items.value.map((item) => ({ ...item, isAdded: false }));
    closeDrawer();

    return data;
  } catch (err) {
    console.error("Ошибка оформления заказа:", err);
  }
};

const addToCart = (item) => {
  const existing = cartItems.value.find((i) => i.id === item.id);
  if (existing) {
    item.isAdded = false;
    cartItems.value = cartItems.value.filter((i) => i.id !== item.id);
  } else {
    item.isAdded = true;
    cartItems.value = [...cartItems.value, item];
  }
};

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      item.isFavorite = true;
      const { data } = await axios.post(`${API_BASE}/favorites`, {
        productId: item.id,
      });
      item.favoriteId = data.id;
    } else {
      item.isFavorite = false;
      await axios.delete(`${API_BASE}/favorites/${item.favoriteId}`);
      item.favoriteId = null;
    }
  } catch (err) {
    console.error("Ошибка обновления избранного:", err);
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
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false,
    }));
  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
  }
};

onMounted(async () => {
  await fetchItems();
  await fetchFavorites();
});
watch(
  filters,
  async () => {
    await fetchItems();
    await fetchFavorites();
  },
  { deep: true },
);
</script>

<template>
  <Drawer
    v-if="isDrawerOpen"
    :cart-items="cartItems"
    @close="closeDrawer"
    :on-create-order="createOrder"
    @remove-from-cart="addToCart"
  />
  <div class="w-4/5 m-auto bg-white rounded-xl shadow-xl mt-10">
    <TheHeader :cart-total="cartTotal" @open-cart="openDrawer" />
    <div class="p-10">
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
    </div>
  </div>
</template>
