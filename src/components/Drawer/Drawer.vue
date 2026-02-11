<script setup>
import { ref } from "vue";
import CartList from "../Cart/CartList.vue";
import DrawerHeader from "./DrawerHeader.vue";
import InfoBlock from "../InfoBlock/InfoBlock.vue";

const props = defineProps({
  cartItems: { type: Array, default: () => [] },
  onCreateOrder: { type: Function, default: null },
  cartTotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
});

const emit = defineEmits(["close", "removeFromCart"]);

const isLoading = ref(false);

const handleClose = () => {
  emit("close");
};

const handleCreateOrder = async () => {
  if (!props.cartItems.length || !props.onCreateOrder) {
    return;
  }

  isLoading.value = true;
  try {
    await props.onCreateOrder();
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/70 z-[100]"
    aria-label="Закрыть корзину"
    @click="handleClose"
  ></div>
  <div
    class="fixed right-0 top-0 h-full w-96 bg-white z-[101] p-8 overflow-y-auto shadow-2xl"
  >
    <DrawerHeader @close="handleClose" />

    <div v-if="!cartItems.length" class="flex h-full items-center">
      <InfoBlock
        title="Корзина пустая"
        descr="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="/package-icon.png"
      />
    </div>

    <div v-else class="flex flex-col h-full">
      <CartList
        :items="cartItems"
        class="flex-1"
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
