import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { createOrder as apiCreateOrder } from "@/api/client";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const isDrawerOpen = ref(false);
  const orderId = ref(null);

  const cartTotal = computed(() =>
    items.value.reduce((sum, item) => sum + (item.price || 0), 0),
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
    const exists = items.value.some((cartItem) => cartItem.id === item.id);
    if (exists) {
      items.value = items.value.filter(
        (cartItem) => cartItem.id !== item.id,
      );
    } else {
      items.value = [...items.value, item];
    }
  };

  const createOrder = async () => {
    if (!items.value.length) return;
    try {
      const order = await apiCreateOrder(items.value);
      orderId.value = order?.id ?? null;
      items.value = [];
    } catch (err) {
      console.error("Ошибка оформления заказа:", err);
      throw err;
    }
  };

  // Сохранение в localStorage
  watch(
    items,
    (value) => {
      localStorage.setItem("cart", JSON.stringify(value));
    },
    { deep: true },
  );

  // Восстановление из localStorage
  const initCart = () => {
    const persisted = localStorage.getItem("cart");
    if (persisted) {
      try {
        items.value = JSON.parse(persisted);
      } catch (err) {
        console.error("Ошибка восстановления корзины:", err);
        items.value = [];
      }
    }
  };

  return {
    items,
    isDrawerOpen,
    orderId,
    cartTotal,
    tax,
    openDrawer,
    closeDrawer,
    toggleCartItem,
    createOrder,
    initCart,
  };
});
