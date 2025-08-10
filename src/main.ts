// Import CSS Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// Import JS Bootstrap (opsional, hanya kalau butuh komponen JS seperti modal, dropdown)
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import $ from "jquery";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "./styles/icons.css";
import "./styles/reset.css";
import "./styles/style.css";
import "./styles/variables.css";

// Make jQuery available globally
(window as any).$ = (window as any).jQuery = $;

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
