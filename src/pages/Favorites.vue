<script setup>
import { inject, onMounted, ref, watch } from "vue";
import {
  getFavorites,
  getItems,
  removeFavorite,
} from "@/api/client";
import { CardList, InfoBlock } from "@/components";

const favoriteItems = ref([]);
const cartContext = inject("cartContext");
const { cartItems, toggleCartItem } = cartContext ?? {};

const fetchFavorites = async () => {
  try {
    const [favorites, allItems] = await Promise.all([
      getFavorites(),
      getItems(),
    ]);
    const itemMap = new Map(allItems.map((i) => [i.id, i]));
    favoriteItems.value = favorites
      .map((fav) => {
        const item = itemMap.get(fav.productId);
        if (!item) return null;
        return {
          ...item,
          imageUrl: item.imageUrl?.startsWith("/") ? item.imageUrl : `/${item.imageUrl}`,
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

const addToCart = (item) => toggleCartItem?.(item);
const addToFavorite = async (item) => {
  try {
    await removeFavorite(item.favoriteId);
    favoriteItems.value = favoriteItems.value.filter((i) => i.id !== item.id);
  } catch (err) {
    console.error("Ошибка удаления из избранного:", err);
  }
};

watch(
  () => cartItems?.value ?? [],
  (val) => {
    favoriteItems.value = favoriteItems.value.map((i) => ({
      ...i,
      isAdded: val.some((c) => c.id === i.id),
    }));
  },
  { deep: true }
);

onMounted(fetchFavorites);
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl sm:text-3xl font-bold animate-fade-in">
      Мои закладки
    </h2>
    <div
      v-if="!favoriteItems.length"
      class="flex flex-col items-center justify-center py-16 sm:py-24"
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
