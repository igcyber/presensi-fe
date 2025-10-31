import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";
import { createHtmlPlugin } from "vite-plugin-html";
import { readFileSync } from "fs";
import { join } from "path";

// Load site metadata
const loadSiteMetadata = () => {
  try {
    const metadataPath = join(process.cwd(), "public", "site-metadata.json");
    const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
    return metadata;
  } catch (error) {
    console.warn("Could not load site metadata:", error);
    return null;
  }
};

const siteMetadata = loadSiteMetadata();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          siteMetadata: siteMetadata || {},
        },
      },
    }),
  ],
  server: {
    allowedHosts: [
      "dev-pelayanan-dprd.kukarkab.go.id",
      "pelayanan-dprd.kukarkab.go.id",
      "dprd.rizkipadhil.my.id",
      "sipesut-setdprd.kukarkab.go.id"
    ],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['lucide-vue-next', 'reka-ui'],
        },
      },
    },
  },
});
