<script setup>
defineProps({
  item: { type: Object, required: true },
});
const emit = defineEmits(["remove"]);
</script>

<template>
  <div class="flex items-center border border-slate-100 p-4 rounded-xl gap-4">
    <img
      class="w-16 h-16 object-cover rounded-lg"
      :src="item.imageUrl"
      :alt="item.title"
    />

    <div class="flex flex-col flex-1 min-w-0">
      <p class="font-medium truncate">{{ item.title }}</p>

      <div class="flex justify-between items-center mt-2">
        <p class="font-bold">{{ item.price }} руб.</p>
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
