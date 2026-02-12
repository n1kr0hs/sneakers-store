<script setup>
defineProps({
  cartTotal: { type: Number, default: 0 },
});
const emit = defineEmits(["open-cart"]);
</script>

<template>
  <header class="flex justify-between border-b border-slate-300 px-10 py-8">
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" class="w-10" />
        <div>
          <h2 class="text-xl font-bold uppercase">Vue Sneakers</h2>
          <p class="text-slate-400">Магазин лучших кроссовок</p>
        </div>
      </div>
    </router-link>

    <ul class="flex items-center gap-10">
      <li
        class="flex items-center cursor-pointer gap-3 text-slate-500 hover:text-black"
        @click="emit('open-cart')"
      >
        <img src="/cart.svg" alt="Cart" />
        <p class="font-bold">{{ cartTotal }} руб.</p>
      </li>

      <router-link to="/favorites"
        ><li
          class="flex items-center cursor-pointer gap-3 text-slate-500 hover:text-black"
        >
          <img src="/heart.svg" alt="Закладки" />
          <p>Закладки</p>
        </li>
      </router-link>

      <li
        class="flex items-center cursor-pointer gap-3 text-slate-500 hover:text-black"
      >
        <img src="/profile.svg" alt="Профиль" />
        <p>Профиль</p>
      </li>
    </ul>
  </header>
</template>
