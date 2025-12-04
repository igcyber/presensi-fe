// Third-party library imports
import $ from "jquery";

import "lightbox2/dist/css/lightbox.min.css";

import { createPinia } from "pinia";
import { configure } from "vee-validate";
// Vue and related imports
import { createApp } from "vue";

// Local imports
import App from "@/App.vue";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";

// Styles
import "@/styles/icons.css";
import "@/styles/main.css";

// Configure vee-validate
configure({
  validateOnInput: false,
  validateOnBlur: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
});

// Setup jQuery globally
(window as any).$ = (window as any).jQuery = $;

// Setup Lightbox
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

// Create and configure Vue app
const app = createApp(App);

app.use(createPinia());
app.use(router);

// Initialize auth store after pinia is mounted
const authStore = useAuthStore();
authStore.initializeAuth();

app.mount("#app");
