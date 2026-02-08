<script setup>
import CardListItem from "./CardListItem.vue";

const props = defineProps({
  items: Array,
});
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <CardListItem
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :imgUrl="item.imageUrl"
      :price="item.price"
    />
  </div>
</template>
