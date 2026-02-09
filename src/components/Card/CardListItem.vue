<script setup>
defineProps({
  id: Number,
  imageUrl: String,
  title: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: { type: Function, default: null },
  onClickAdd: { type: Function, default: null },
});
</script>

<template>
  <div
    class="relative bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
  >
    <img
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      @click.stop="onClickFavorite?.()"
      alt="Like"
      class="absolute top-8 left-8"
    />
    <img :src="imageUrl" alt="Sneaker" />
    <p class="mt-2">{{ title }}</p>

    <div class="flex justify-between mt-5">
      <div class="flex flex-col">
        <span class="text-slate-400">Цена:</span>
        <span class="font-bold">{{ price }} руб.</span>
      </div>

      <img
        :src="!isAdded ? '/plus.svg' : '/checked.svg'"
        @click.stop="onClickAdd?.()"
        alt="Добавить в корзину"
      />
    </div>
  </div>
</template>
