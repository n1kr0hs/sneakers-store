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
    class="group relative flex flex-col h-full bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-lime-200"
  >
    <img
      :src="!isFavorite ? 'like-1.svg' : 'like-2.svg'"
      @click.stop="onClickFavorite?.()"
      alt="В избранное"
      class="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 opacity-80 hover:opacity-100 transition-opacity z-10"
    />
    <img
      :src="imageUrl"
      :alt="title"
      class="relative z-0 w-full h-40 sm:h-48 object-contain transition-transform duration-300 group-hover:scale-105"
    />
    <p class="mt-3 text-sm sm:text-base flex-1">
      {{ title }}
    </p>

    <div class="flex justify-between items-end mt-4 sm:mt-5">
      <div class="flex flex-col">
        <span class="text-slate-400 text-xs sm:text-sm">Цена:</span>
        <span class="font-bold text-sm sm:text-base">{{ price }} руб.</span>
      </div>

      <img
        :src="!isAdded ? 'plus.svg' : 'checked.svg'"
        @click.stop="onClickAdd?.()"
        alt="Добавить в корзину"
        class="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity"
      />
    </div>
  </div>
</template>
