<script setup>
import CartListItem from "./CartListItem.vue";

defineProps({
  items: { type: Array, default: () => [] },
});
const emit = defineEmits(["remove"]);
</script>

<template>
  <div class="flex flex-col gap-4" v-auto-animate>
    <CartListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @remove="emit('remove', item)"
    />
  </div>
</template>
