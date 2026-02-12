<script setup>
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
});
const emit = defineEmits(["remove"]);

const formattedPrice = computed(() => {
  if (!props.item.price) return "0";
  return props.item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u200A");
});
</script>

<template>
  <div
    class="flex items-center border border-slate-100 p-3 sm:p-4 rounded-xl gap-3 sm:gap-4 transition-all hover:border-lime-200"
  >
    <img
      class="w-16 h-16 object-cover rounded-lg"
      :src="item.imageUrl"
      :alt="item.title"
    />

    <div class="flex flex-col flex-1 min-w-0">
      <p class="font-medium truncate">{{ item.title }}</p>

      <div class="flex justify-between items-center mt-2">
        <p class="font-bold">{{ formattedPrice }} руб.</p>
        <img
          class="opacity-40 hover:opacity-100 cursor-pointer transition w-5 h-5"
          src="/close.svg"
          alt="Удалить"
          @click="emit('remove')"
        />
      </div>
    </div>
  </div>
</template>
