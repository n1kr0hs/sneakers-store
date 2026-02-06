<script setup>
import CardListItem from "./CardListItem.vue";
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <CardListItem
      img-url="/sneakers/sneakers-1.jpg"
      title="Puma"
      :price="5000"
    />
  </div>
</template>
