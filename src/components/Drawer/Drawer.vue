<script setup>
import { computed, ref } from "vue";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/utils/formatPrice";
import CartList from "../Cart/CartList.vue";
import DrawerHeader from "./DrawerHeader.vue";
import InfoBlock from "../InfoBlock/InfoBlock.vue";

const cartStore = useCartStore();
const isLoading = ref(false);

const formattedCartTotal = computed(() => formatPrice(cartStore.cartTotal));
const formattedTax = computed(() => formatPrice(cartStore.tax));

const handleClose = () => {
  cartStore.closeDrawer();
};

const handleCreateOrder = async () => {
  if (!cartStore.items.length) return;

  isLoading.value = true;
  try {
    await cartStore.createOrder();
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

    <div v-if="cartStore.orderId" class="flex h-full items-center">
      <InfoBlock
        title="Заказ оформлен!"
        :descr="`Ваш заказ #${cartStore.orderId} скоро будет передан курьерской доставке`"
        image-url="order-success-icon.png"
      />
    </div>

    <div v-else-if="!cartStore.items.length" class="flex h-full items-center">
      <InfoBlock
        title="Корзина пустая"
        descr="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="package-icon.png"
      />
    </div>

    <div v-else class="flex flex-col">
      <CartList class="flex-1 pb-2 sm:pb-4" />

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
          :disabled="!cartStore.items.length || isLoading"
          class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white font-medium cursor-pointer hover:bg-lime-600 active:bg-lime-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          @click="handleCreateOrder"
        >
          {{ isLoading ? "Оформление..." : "Оформить заказ" }}
        </button>
      </div>
    </div>
  </div>
</template>
