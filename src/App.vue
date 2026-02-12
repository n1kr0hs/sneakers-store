<script setup>
import { RouterView } from "vue-router";
import { Drawer, TheHeader } from "@/components";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();
</script>

<template>
  <Drawer v-if="cartStore.isDrawerOpen" @close="cartStore.closeDrawer" />
  <div class="w-full max-w-6xl mx-auto px-3 sm:px-6 mt-4 mb-4 sm:my-10">
    <div
      class="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl"
    >
      <TheHeader @open-cart="cartStore.openDrawer" />
      <div class="p-4 sm:p-6 lg:p-10">
        <RouterView />
      </div>
    </div>
  </div>
</template>
