import $ from "jquery";

import "lightbox2/dist/css/lightbox.min.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";

import "@/styles/icons.css";
import "@/styles/main.css";
import "@/styles/variables.css";

(window as any).$ = (window as any).jQuery = $;

const lightboxModule = await import("lightbox2/dist/js/lightbox.js");

if (lightboxModule && lightboxModule.default && typeof lightboxModule.default.option === "function") {
  (window as any).lightbox = lightboxModule.default;
  (window as any).lightbox.option({
    fadeDuration: 200,
    imageFadeDuration: 200,
    resizeDuration: 200,
    wrapAround: true,
    disableScrolling: true,
    positionFromTop: 150,
    centerVertically: true,
  });
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
