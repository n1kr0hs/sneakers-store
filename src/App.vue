<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import axios from "axios";
import { RouterView } from "vue-router";
import { Drawer, TheHeader } from "@/components";

const API_BASE = "https://14ef51dbd6f2e9ea.mokky.dev";

const cartItems = ref([]);
const isDrawerOpen = ref(false);

const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + (item.price || 0), 0),
);
const tax = computed(() => Math.round(cartTotal.value * 0.05));

const openDrawer = () => {
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const toggleCartItem = (item) => {
  const exists = cartItems.value.some((cartItem) => cartItem.id === item.id);
  if (exists) {
    cartItems.value = cartItems.value.filter(
      (cartItem) => cartItem.id !== item.id,
    );
  } else {
    cartItems.value = [...cartItems.value, item];
  }
};

const createOrder = async () => {
  if (!cartItems.value.length) {
    return;
  }

  try {
    await axios.post(`${API_BASE}/orders`, {
      items: cartItems.value,
    });

    cartItems.value = [];
    closeDrawer();
  } catch (err) {
    console.error("Ошибка оформления заказа:", err);
  }
};

provide("cartContext", {
  cartItems,
  cartTotal,
  tax,
  isDrawerOpen,
  openDrawer,
  closeDrawer,
  toggleCartItem,
  createOrder,
});

watch(
  cartItems,
  (value) => {
    localStorage.setItem("cart", JSON.stringify(value));
  },
  { deep: true },
);

onMounted(() => {
  const persisted = localStorage.getItem("cart");
  cartItems.value = persisted ? JSON.parse(persisted) : [];
});
</script>

<template>
  <Drawer
    v-if="isDrawerOpen"
    :cart-items="cartItems"
    :cart-total="cartTotal"
    :tax="tax"
    :on-create-order="createOrder"
    @close="closeDrawer"
    @remove-from-cart="toggleCartItem"
  />
  <div class="w-4/5 m-auto bg-white rounded-xl shadow-xl mt-10">
    <TheHeader :cart-total="cartTotal" @open-cart="openDrawer" />
    <div class="p-10">
      <RouterView />
    </div>
  </div>
</template>
