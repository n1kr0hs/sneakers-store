<!--SFC - Single File Component - в одном файле логика, верстка, стилизация-->
<script setup>
import { ref } from "vue";
import { CardList, Drawer, TheHeader } from "./components";

const isDrawerOpen = ref(true);

function handleDrawerClose() {
  console.log("Событие close из Drawer дошло до родителя");
  isDrawerOpen.value = false;
}
</script>

<template>
  <Drawer v-if="isDrawerOpen" @close="handleDrawerClose" />
  <div class="w-4/5 m-auto bg-white rounded-xl shadow-xl mt-10">
    <TheHeader />
    <div class="p-10">
      <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>
      <CardList />
    </div>
  </div>
</template>
