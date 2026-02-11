<script setup>
import { computed, ref } from "vue";
import CartList from "../Cart/CartList.vue";
import DrawerHeader from "./DrawerHeader.vue";
import InfoBlock from "../InfoBlock/InfoBlock.vue";

const props = defineProps({
  cartItems: { type: Array, default: () => [] },
  onCreateOrder: { type: Function, default: null },
});
const emit = defineEmits(["close", "removeFromCart"]);

const cartTotal = computed(() =>
  props.cartItems.reduce((sum, item) => sum + (item.price || 0), 0),
);
const tax = computed(() => Math.round(cartTotal.value * 0.05));

const isLoading = ref(false);

function handleClose() {
  emit("close");
}

async function handleCreateOrder() {
  if (!props.cartItems.length || !props.onCreateOrder) return;
  isLoading.value = true;
  try {
    await props.onCreateOrder();
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-100 opacity-70"></div>
  <div
    class="bg-white w-96 h-full fixed right-0 top-0 z-101 p-8 overflow-y-auto"
  >
    <DrawerHeader @close="handleClose" />

    <div v-if="!cartTotal" class="flex h-full items-center">
      <InfoBlock
        title="Корзина пустая"
        descr="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="package-icon.png"
      />
    </div>

    <div else>
      <CartList :items="cartItems" @remove="emit('removeFromCart', $event)" />

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
          :disabled="!cartItems.length || isLoading"
          class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white cursor-pointer hover:bg-lime-600 active:bg-lime-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
          @click="handleCreateOrder"
        >
          {{ isLoading ? "Оформление..." : "Оформить заказ" }}
        </button>
      </div>
    </div>
  </div>
</template>
