<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import { RouterView } from "vue-router";
import { createOrder as apiCreateOrder } from "@/api/client";
import { Drawer, TheHeader } from "@/components";

const cartItems = ref([]);
const isDrawerOpen = ref(false);
const orderId = ref(null);

const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + (item.price || 0), 0),
);
const tax = computed(() => Math.round(cartTotal.value * 0.05));

const openDrawer = () => {
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  orderId.value = null;
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
  if (!cartItems.value.length) return;
  try {
    const order = await apiCreateOrder(cartItems.value);
    orderId.value = order?.id ?? null;
    cartItems.value = [];
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
    :order-id="orderId"
    :on-create-order="createOrder"
    @close="closeDrawer"
    @remove-from-cart="toggleCartItem"
  />
  <div class="w-full max-w-6xl mx-auto px-3 sm:px-6 mt-4 mb-4 sm:my-10">
    <div
      class="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl"
    >
      <TheHeader :cart-total="cartTotal" @open-cart="openDrawer" />
      <div class="p-4 sm:p-6 lg:p-10">
        <RouterView />
      </div>
    </div>
  </div>
</template>
