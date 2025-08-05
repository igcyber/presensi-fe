import { type RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

import NotFound from "@/pages/NotFound.vue";

/**
 * Tipe untuk modul yang diimpor dari direktori pages
 */
type RouteModule = {
  default: RouteRecordRaw | RouteRecordRaw[];
};

// Import semua modules dinamis yang ada di folder pages untuk file router.ts
// Ini akan mengimport semua file router.ts yang ada di folder pages ('../pages/**/router.ts')
// parameter {eager: true} akan memuat file router.ts secara langsung bukan secara lazy loading
const modules = import.meta.glob<RouteModule>("../pages/**/router.ts", {
  eager: true,
});

// Mengumpulkan semua rute dari file router.js yang ditemukan
const dynamicRoutes: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const module = modules[key];

  if (module.default) {
    // Menangani berbagai format ekspor router
    if (Array.isArray(module.default)) {
      // Jika ekspor adalah array rute (format umum)
      dynamicRoutes.push(...module.default);
    } else {
      // Jika ekspor adalah objek rute tunggal
      dynamicRoutes.push(module.default);
    }
  }
});

// Routes
const routes: RouteRecordRaw[] = [
  // Dynamic Routes yang ada di folder pages
  ...dynamicRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: {
      title: "Page Not Found",
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guard untuk Authentication
router.beforeEach((to, from, next) => {
  next();
});

export default router;
