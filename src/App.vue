<!--SFC - Single File Component - в одном файле логика, верстка, стилизация-->
<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import axios from "axios";
import { CardList, Drawer, TheHeader } from "./components";

const isDrawerOpen = ref(true);
const items = ref([]); // {value: []}
const filters = reactive({
  sortBy: "title",
  searchQuery: "",
});

function handleDrawerClose() {
  isDrawerOpen.value = false;
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value;
};

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
    };

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`;
    }

    const { data } = await axios.get(
      "https://14ef51dbd6f2e9ea.mokky.dev/items",
      {
        params,
      },
    );
    items.value = data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(fetchItems);
watch(filters, fetchItems);
</script>

<template>
  <Drawer v-if="isDrawerOpen" @close="handleDrawerClose" />
  <div class="w-4/5 m-auto bg-white rounded-xl shadow-xl mt-10">
    <TheHeader />
    <div class="p-10">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

        <div class="flex gap-4">
          <select
            @change="onChangeSelect"
            class="py-2 px-3 border border-gray-200 rounded-md outline-none"
            name=""
            id=""
          >
            <option value="name">По названию</option>
            <option value="price">По цене (дешевые)</option>
            <option value="-price">По цене (Дорогие)</option>
          </select>

          <div class="relative">
            <img class="absolute left-4 top-3" src="/search.svg" alt="Search" />
            <input
              @input="onChangeSearchInput"
              class="border border-gray-200 rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
              placeholder="Поиск..."
              type="`text`"
            />
          </div>
        </div>
      </div>
      <CardList :items="items" />
    </div>
  </div>
</template>
