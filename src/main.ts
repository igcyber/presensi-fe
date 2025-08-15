// Import CSS Bootstrap
import $ from "jquery";

import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "lightbox2/dist/css/lightbox.min.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";

import "@/styles/icons.css";
import "@/styles/reset.css";
import "@/styles/style.css";
import "@/styles/variables.css";

// Set jQuery globally FIRST
(window as any).$ = (window as any).jQuery = $;

// Import bootstrap dan lightbox
import("bootstrap/dist/js/bootstrap.bundle.min.js");

// Import dan konfigurasi lightbox2 dengan cara yang benar
const lightboxModule = await import("lightbox2/dist/js/lightbox.js");

let lightboxConfigured = false;

// Strategy 1: Import berhasil dan module memiliki default export
if (lightboxModule && lightboxModule.default && typeof lightboxModule.default.option === "function") {
  // Set sebagai global
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
  lightboxConfigured = true;
}

if (lightboxConfigured) {
  // Emit custom event to notify components
  window.dispatchEvent(new CustomEvent("lightboxReady"));
} else {
  console.error("❌ Gagal menginisialisasi lightbox dengan semua strategi");
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
