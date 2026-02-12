<script setup>
import { computed, ref } from "vue";
import CartList from "../Cart/CartList.vue";
import DrawerHeader from "./DrawerHeader.vue";
import InfoBlock from "../InfoBlock/InfoBlock.vue";

const props = defineProps({
  cartItems: { type: Array, default: () => [] },
  onCreateOrder: { type: Function, default: null },
  cartTotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  orderId: { type: [Number, String], default: null },
});

const emit = defineEmits(["close", "removeFromCart"]);

const isLoading = ref(false);

const formatPrice = (price) => {
  if (!price) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u200A");
};

const formattedCartTotal = computed(() => formatPrice(props.cartTotal));
const formattedTax = computed(() => formatPrice(props.tax));

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
    class="fixed inset-0 bg-black/70 z-[100] animate-fade-in"
    aria-label="Закрыть корзину"
    @click="handleClose"
  ></div>
  <div
    class="fixed right-0 top-0 h-full w-full sm:w-96 max-w-full bg-white z-[101] p-4 sm:p-8 overflow-y-auto shadow-2xl animate-slide-in"
  >
    <DrawerHeader @close="handleClose" />

    <div v-if="orderId" class="flex h-full items-center">
      <InfoBlock
        title="Заказ оформлен!"
        :descr="`Ваш заказ #${orderId} скоро будет передан курьерской доставке`"
        image-url="order-success-icon.png"
      />
    </div>

    <div v-else-if="!cartItems.length" class="flex h-full items-center">
      <InfoBlock
        title="Корзина пустая"
        descr="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="package-icon.png"
      />
    </div>

    <div v-else class="flex flex-col">
      <CartList
        :items="cartItems"
        class="flex-1 pb-2 sm:pb-4"
        @remove="emit('removeFromCart', $event)"
      />

      <div class="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 pb-2">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <p class="font-bold">{{ formattedCartTotal }} руб.</p>
        </div>

        <div class="flex gap-2">
          <span>Налог 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <p class="font-bold">{{ formattedTax }} руб.</p>
        </div>

        <button
          :disabled="!cartItems.length || isLoading"
          class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white font-medium cursor-pointer hover:bg-lime-600 active:bg-lime-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          @click="handleCreateOrder"
        >
          {{ isLoading ? "Оформление..." : "Оформить заказ" }}
        </button>
      </div>
    </div>
  </div>
</template>
