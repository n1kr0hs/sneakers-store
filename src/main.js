import { createApp } from "vue";
import { createPinia } from "pinia";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import App from "./App.vue";
import router from "./router";
import { useCartStore } from "./stores/cart";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(autoAnimatePlugin);

const cartStore = useCartStore();
cartStore.initCart();

app.mount("#app");
