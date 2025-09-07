import { createRouter, createWebHistory, type RouteRecordRaw, type RouterScrollBehavior } from "vue-router";

import NotFound from "@/pages/NotFound.vue";
import { useAuthStore } from "@/stores/authStore";

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

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  // Jika navigasi via tombol back/forward, kembalikan posisi sebelumnya
  if (savedPosition) {
    return savedPosition; // atau { ...savedPosition, behavior: 'smooth' }
  }
  // Jika ada hash (#section), scroll ke elemen tsb + offset header (jika perlu)
  if (to.hash) {
    return { el: to.hash, top: 80, behavior: "smooth" }; // sesuaikan offset navbar-mu
  }
  // Default: ke paling atas
  return { left: 0, top: 0, behavior: "smooth" }; // ganti 'smooth' ke 'auto' bila ingin instan
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior,
});

// Navigation Guard untuk Authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth !== false; // Default true kecuali explicitly false
  const isAuthRoute = to.name === "login.index";

  // Jika sudah login dan mencoba akses halaman auth (login), redirect ke dashboard
  if (isAuthenticated && isAuthRoute) {
    next({ name: "app.dashboard" });
    return;
  }

  // Jika belum login dan mencoba akses halaman yang perlu auth, redirect ke login
  if (!isAuthenticated && requiresAuth) {
    next({ name: "login.index" });
    return;
  }

  // Jika token expired, clear auth dan redirect ke login
  if (isAuthenticated && authStore.isTokenExpired) {
    authStore.logout();
    if (requiresAuth) {
      next({ name: "login.index" });
      return;
    }
  }

  next();
});

export default router;
