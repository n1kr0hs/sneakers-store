<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { getItems } from "@/api/client";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { CardList, InfoBlock } from "@/components";

const favoriteItems = ref([]);
const isLoading = ref(true);

const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();

const fetchFavorites = async () => {
  try {
    isLoading.value = true;
    await favoritesStore.fetchFavorites();
    const allItems = await getItems();
    const itemMap = new Map(allItems.map((i) => [i.id, i]));
    
    favoriteItems.value = Array.from(favoritesStore.favoriteIds)
      .map((productId) => {
        const item = itemMap.get(productId);
        if (!item) return null;
        return {
          ...item,
          imageUrl: item.imageUrl || "",
          isFavorite: true,
          favoriteId: favoritesStore.getFavoriteId(productId),
          isAdded: cartStore.items.some((c) => c.id === item.id),
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("Ошибка загрузки избранного:", err);
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (item) => {
  cartStore.toggleCartItem(item);
};

const addToFavorite = async (item) => {
  try {
    await favoritesStore.removeFavorite(item.id);
    favoriteItems.value = favoriteItems.value.filter((i) => i.id !== item.id);
  } catch (err) {
    console.error("Ошибка удаления из избранного:", err);
  }
};

watch(
  () => cartStore.items,
  () => {
    favoriteItems.value = favoriteItems.value.map((i) => ({
      ...i,
      isAdded: cartStore.items.some((c) => c.id === i.id),
    }));
  },
  { deep: true },
);

onMounted(fetchFavorites);
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl sm:text-3xl font-bold animate-fade-in">Мои закладки</h2>
    <div
      v-if="!isLoading && !favoriteItems.length"
      class="flex flex-col items-center justify-center py-16 sm:py-24"
    >
      <InfoBlock
        title="Закладок пока нет"
        descr="Добавляйте товары в избранное — они появятся здесь"
        image-url="heart.svg"
      />
    </div>
    <CardList
      v-else-if="!isLoading"
      :items="favoriteItems"
      @add-to-favorite="addToFavorite"
      @add-to-cart="addToCart"
    />
  </div>
</template>
