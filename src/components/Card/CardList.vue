<script setup>
import CardListItem from "./CardListItem.vue";

defineProps({
  items: Array,
});
const emit = defineEmits(["addToFavorite", "addToCart"]);
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 animate-stagger"
    v-auto-animate
  >
    <CardListItem
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :title="item.title"
      :image-url="item.imageUrl"
      :price="item.price"
      :is-favorite="item.isFavorite"
      :is-added="item.isAdded"
      :on-click-favorite="() => emit('addToFavorite', item)"
      :on-click-add="() => emit('addToCart', item)"
    />
  </div>
</template>
