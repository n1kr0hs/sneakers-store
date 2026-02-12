<script setup>
import { useCartStore } from "@/stores/cart";
import CartListItem from "./CartListItem.vue";

const cartStore = useCartStore();
</script>

<template>
  <div class="flex flex-col gap-4" v-auto-animate>
    <CartListItem
      v-for="item in cartStore.items"
      :key="item.id"
      :item="item"
      @remove="cartStore.toggleCartItem(item)"
    />
  </div>
</template>
