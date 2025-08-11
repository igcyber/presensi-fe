// Import CSS Bootstrap
import $ from "jquery";

import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "./styles/icons.css";
import "./styles/reset.css";
import "./styles/style.css";
import "./styles/variables.css";

import("bootstrap/dist/js/bootstrap.bundle.min.js");

(window as any).$ = (window as any).jQuery = $;

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
