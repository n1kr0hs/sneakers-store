<script setup>
import CardListItem from "./CardListItem.vue";

const props = defineProps({
  items: Array,
});

const emit = defineEmits(["addToFavorite"]);
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <CardListItem
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :title="item.title"
      :imgUrl="item.imageUrl"
      :price="item.price"
      :onClickFavorite="() => emit('addToFavorite', item)"
      :isFavorite="item.isFavorite"
    />
  </div>
</template>
