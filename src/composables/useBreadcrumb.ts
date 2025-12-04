import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useFormatters } from "@/composables/useFormatters";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

// Context untuk dynamic breadcrumb (misal: nama kegiatan dari API)
const context = ref<string>("");

/**
 * Composable untuk mengelola breadcrumb secara otomatis
 * Menggunakan route meta dan params untuk generate breadcrumb
 */
export function useBreadcrumb() {
  const route = useRoute();
  const router = useRouter();
  const { slugToTitle } = useFormatters();

  /**
   * Mapping untuk label breadcrumb berdasarkan route name
   */
  const routeLabels: Record<string, string> = {
    // Media (Public)
    "media.berita": "Berita",
    "media.berita.detail": "Detail Berita",

    // App
    "app.dashboard": "Dashboard",
    "app.dashboard-data": "Dashboard Data",
    "app.user": "User",
    "app.user.detail": "Detail User",
    "app.tags": "Tags",
    "app.tags.detail": "Detail Tag",
  };

  /**
   * Mapping untuk parent routes (untuk hirarki breadcrumb)
   */
  const routeHierarchy: Record<string, string[]> = {
    // Media (Public)
    "media.berita": [],
    "media.berita.detail": ["media.berita"],

    // App
    "app.dashboard": [],
    "app.dashboard-data": [],
    "app.user": ["app.dashboard"],
    "app.user.detail": ["app.dashboard", "app.user"],
    "app.tags": ["app.dashboard"],
    "app.tags.detail": ["app.dashboard", "app.tags"],
  };

  /**
   * Generate breadcrumb items berdasarkan route saat ini
   */
  const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [];
    const currentRouteName = route.name as string;

    // Jika tidak ada route name, return empty
    if (!currentRouteName) return items;

    // Dapatkan hirarki untuk route saat ini
    const hierarchy = routeHierarchy[currentRouteName] || [];

    // Tambahkan parent routes
    hierarchy.forEach((parentRouteName) => {
      const label = routeLabels[parentRouteName];
      if (label) {
        items.push({
          label,
          href: getRouteHref(parentRouteName),
          active: false,
        });
      } else {
        items.push({
          label: parentRouteName,
          href: "#",
          active: false,
        });
      }
    });

    // Tambahkan route saat ini
    const currentLabel = getCurrentRouteLabel();
    if (currentLabel) {
      items.push({
        label: currentLabel,
        active: true,
      });
    }

    return items;
  });

  // function untuk mendapatkan title dari route
  const getTitleFromRoute = (): string => {
    return getCurrentRouteLabel();
  };

  /**
   * Dapatkan href untuk route tertentu
   */
  function getRouteHref(routeName: string): string {
    try {
      const resolved = router.resolve({ name: routeName });
      return resolved.href;
    } catch {
      return "#";
    }
  }

  /**
   * Dapatkan label untuk route saat ini
   * Bisa dari meta.title, mapping, atau dynamic berdasarkan params
   */
  function getCurrentRouteLabel(): string {
    const routeName = route.name as string;

    // Cek di meta.title dulu
    if (route.meta?.title) {
      return route.meta.title as string;
    }

    // Cek di mapping
    if (routeLabels[routeName]) {
      return routeLabels[routeName];
    }

    // Fallback ke route name
    const fallback = routeName?.split(".").pop()?.replace("-", " ");
    return fallback || "Unknown";
  }

  /**
   * Navigate to breadcrumb item
   */
  function navigateTo(item: BreadcrumbItem) {
    if (item.href && !item.active) {
      router.push(item.href);
    }
  }

  /**
   * Set context untuk dynamic breadcrumb
   */
  function setContext(newContext: string) {
    context.value = newContext;
  }

  /**
   * Clear context
   */
  function clearContext() {
    context.value = "";
  }

  return {
    breadcrumbItems,
    navigateTo,
    setContext,
    clearContext,
    context,
    getTitleFromRoute,
  };
}
