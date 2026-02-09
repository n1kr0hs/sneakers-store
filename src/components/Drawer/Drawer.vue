<script setup>
import { computed } from "vue";
import CartList from "../Cart/CartList.vue";
import DrawerHeader from "./DrawerHeader.vue";

const props = defineProps({
  cartItems: { type: Array, default: () => [] },
});
const emit = defineEmits(["close", "removeFromCart"]);

const cartTotal = computed(() =>
  props.cartItems.reduce((sum, item) => sum + (item.price || 0), 0)
);
const tax = computed(() => Math.round(cartTotal.value * 0.05));

function handleClose() {
  emit("close");
}
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-[100] opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-[101] p-8 overflow-y-auto">
    <DrawerHeader @close="handleClose" />
    <CartList
      :items="cartItems"
      @remove="emit('removeFromCart', $event)"
    />

    <div class="flex flex-col gap-4 mt-7">
      <div class="flex gap-2">
        <span>Итого:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <p class="font-bold">{{ cartTotal }} руб.</p>
      </div>

      <div class="flex gap-2">
        <span>Налог 5%:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <p class="font-bold">{{ tax }} руб.</p>
      </div>

      <button
        :disabled="!cartItems.length"
        class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white cursor-pointer hover:bg-lime-600 active:bg-lime-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>
