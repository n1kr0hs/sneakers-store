<script setup>
import { computed } from "vue";

const props = defineProps({
  cartTotal: { type: Number, default: 0 },
});
const emit = defineEmits(["open-cart"]);

const formattedCartTotal = computed(() => {
  if (!props.cartTotal) return "0";
  return props.cartTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u200A");
});
</script>

<template>
  <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-5 sm:py-6">
    <router-link to="/" class="flex items-center gap-3 sm:gap-4 group">
      <img src="/logo.png" alt="Logo" class="w-9 sm:w-10 transition-transform group-hover:scale-105" />
      <div>
        <h2 class="text-lg sm:text-xl font-bold uppercase">Sneakers Store</h2>
        <p class="text-slate-400 text-sm hidden sm:block">Магазин лучших кроссовок</p>
      </div>
    </router-link>

    <ul class="flex items-center gap-4 sm:gap-6 lg:gap-10 w-full sm:w-auto justify-end">
      <li
        class="flex items-center cursor-pointer gap-2 sm:gap-3 text-slate-500 hover:text-black transition-colors"
        @click="emit('open-cart')"
      >
        <img src="/cart.svg" alt="Корзина" class="w-5 h-5 sm:w-6 sm:h-6" />
        <p class="font-bold text-sm sm:text-base">{{ formattedCartTotal }} руб.</p>
      </li>

      <li>
        <router-link
          to="/favorites"
          class="flex items-center gap-2 sm:gap-3 text-slate-500 hover:text-black transition-colors"
        >
          <img src="/heart.svg" alt="Закладки" class="w-5 h-5 sm:w-6 sm:h-6" />
          <span class="hidden sm:inline">Закладки</span>
        </router-link>
      </li>

      <li class="flex items-center gap-2 sm:gap-3 text-slate-500 hover:text-black transition-colors cursor-pointer">
        <img src="/profile.svg" alt="Профиль" class="w-5 h-5 sm:w-6 sm:h-6" />
        <p class="hidden sm:inline">Профиль</p>
      </li>
    </ul>
  </header>
</template>
