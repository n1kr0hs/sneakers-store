<script setup>
import { inject, onMounted, ref, watch } from "vue";
import axios from "axios";
import { CardList, InfoBlock } from "@/components";

const API_BASE = "https://14ef51dbd6f2e9ea.mokky.dev";

const favoriteItems = ref([]);

const cartContext = inject("cartContext");
const { cartItems, toggleCartItem } = cartContext ?? {};

const fetchFavorites = async () => {
  try {
    const [{ data: favorites }, { data: allItems }] = await Promise.all([
      axios.get(`${API_BASE}/favorites`),
      axios.get(`${API_BASE}/items`),
    ]);

    const itemMap = new Map(allItems.map((item) => [item.id, item]));

    favoriteItems.value = favorites
      .map((fav) => {
        const item = itemMap.get(fav.productId);
        if (!item) return null;
        return {
          ...item,
          imageUrl: item.imageUrl?.startsWith("/")
            ? item.imageUrl
            : `/${item.imageUrl}`,
          isFavorite: true,
          favoriteId: fav.id,
          isAdded: cartItems?.value?.some((c) => c.id === item.id) ?? false,
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("Ошибка загрузки избранного:", err);
  }
};

const addToCart = (item) => {
  if (cartContext) {
    toggleCartItem(item);
  }
};

const addToFavorite = async (item) => {
  try {
    await axios.delete(`${API_BASE}/favorites/${item.favoriteId}`);
    favoriteItems.value = favoriteItems.value.filter((i) => i.id !== item.id);
  } catch (err) {
    console.error("Ошибка удаления из избранного:", err);
  }
};

watch(
  () => cartItems?.value ?? [],
  (value) => {
    favoriteItems.value = favoriteItems.value.map((item) => ({
      ...item,
      isAdded: value.some((c) => c.id === item.id),
    }));
  },
  { deep: true },
);

onMounted(fetchFavorites);
</script>

<template>
  <div>
    <h2 class="text-3xl font-bold mb-8">Мои закладки</h2>
    <div
      v-if="!favoriteItems.length"
      class="flex flex-col items-center justify-center py-20"
    >
      <InfoBlock
        title="Закладок пока нет"
        descr="Добавляйте товары в избранное — они появятся здесь"
        image-url="/heart.svg"
      />
    </div>
    <CardList
      v-else
      :items="favoriteItems"
      @add-to-favorite="addToFavorite"
      @add-to-cart="addToCart"
    />
  </div>
</template>
