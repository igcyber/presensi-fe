import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "./styles/base.css";
// Import global styles
import "./styles/variables.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
