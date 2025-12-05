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

const sortedRoutes = dynamicRoutes.sort((a, b) => {
  // helper: cek apakah route punya requiresAuth
  const aAuth = a.meta?.requiresAuth ?? false;
  const bAuth = b.meta?.requiresAuth ?? false;

  // helper: cek apakah route punya children
  const aHasChildren = Array.isArray(a.children) && a.children.length > 0;
  const bHasChildren = Array.isArray(b.children) && b.children.length > 0;

  // rule utama:
  // - route tanpa requiresAuth lebih dulu
  if (aAuth !== bAuth) {
    return aAuth ? 1 : -1;
  }

  // - route tanpa children lebih dulu
  if (aHasChildren !== bHasChildren) {
    return aHasChildren ? 1 : -1;
  }

  return 0; // kalau sama, tidak berubah
});

// Routes
const routes: RouteRecordRaw[] = [
  // Dynamic Routes yang ada di folder pages
  ...sortedRoutes,

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
  const requiresAuth = to.meta?.requiresAuth === true; // Default false, kecuali explicitly true
  const isAuthRoute = to.name === "login.index";

  // Peran yang dibutuhkan untuk rute
  const requiredRoles = to.meta?.roles as string[] | undefined;
  const userRoles = authStore.user?.roles || [];

  // Jika sudah login dan mencoba akses halaman auth (login), redirect ke dashboard
  if (isAuthenticated && isAuthRoute) {
    // Alihkan ke dashboard yang sesuai jika sudah login
    if (authStore.isAdmin) {
      next({ name: "app.dashboard" });
    } else if (authStore.isPegawai) {
      next({ name: "pegawai.absensi-harian" });
    } else {
      next({ name: "app.dashboard" }); // Fallback
    }
    return;
  }

  // Jika belum login dan mencoba akses halaman yang perlu auth, redirect ke login
  if (!isAuthenticated && requiresAuth) {
    next({ name: "login.index" });
    return;
  }

  if (isAuthenticated && requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      // Jika tidak memiliki peran yang dibutuhkan, arahkan ke halaman utama role-nya
      if (authStore.isAdmin) {
        next({ name: "app.dashboard" });
      } else if (authStore.isPegawai) {
        next({ name: "pegawai.absensi-harian" });
      } else {
        // Jika tidak ada peran sama sekali, log out
        authStore.logout();
        next({ name: "login.index" });
      }
      return;
    }
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
