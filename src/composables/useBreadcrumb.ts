import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

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

  /**
   * Mapping untuk label breadcrumb berdasarkan route name
   */
  const routeLabels: Record<string, string> = {
    // Selayang Pandang
    "selayang-pandang.sejarah": "Sejarah",
    "selayang-pandang.kependudukan": "Kependudukan",
    "selayang-pandang.potensi-daerah": "Potensi Daerah",
    "selayang-pandang.prestasi": "Prestasi dan Penghargaan",

    // Media
    "media.video": "Video",
    "media.dokumen": "Dokumen",
    "media.infografis": "Infografis",
    "media.majalah": "Majalah",

    // Pemerintahan
    "pemerintahan.tugas-dan-fungsi": "Tugas dan Fungsi",
    "pemerintahan.struktur-organisasi": "Struktur Organisasi",
    "pemerintahan.visi-misi": "Visi dan Misi",
    "pemerintahan.strategi": "Strategi Daerah",
    "pemerintahan.program-strategis": "Program Daerah",
    "pemerintahan.bupati": "Bupati Daerah",
    "pemerintahan.transparansi-keuangan": "Transparansi Keuangan",
    "pemerintahan.transparansi-keuangan-detail": "Detail Transparansi Keuangan",

    // Berita
    "berita.index": "Berita",
    "berita.detail": "Detail Berita",
  };

  /**
   * Mapping untuk parent routes (untuk hirarki breadcrumb)
   */
  const routeHierarchy: Record<string, string[]> = {
    // Selayang Pandang
    "selayang-pandang.prestasi": ["Selayang Pandang"],
    "selayang-pandang.potensi-daerah": ["Selayang Pandang"],
    "selayang-pandang.kependudukan": ["Selayang Pandang"],
    "selayang-pandang.sejarah": ["Selayang Pandang"],

    // Media
    "media.video": ["Media"],
    "media.dokumen": ["Media"],
    "media.infografis": ["Media"],
    "media.majalah": ["Media"],

    // Pemerintahan
    "pemerintahan.transparansi-keuangan-detail": ["Pemerintahan", "pemerintahan.transparansi-keuangan"],
    "pemerintahan.transparansi-keuangan": ["Pemerintahan"],
    "pemerintahan.program-strategis": ["Pemerintahan"],
    "pemerintahan.strategi": ["Pemerintahan"],
    "pemerintahan.visi-misi": ["Pemerintahan"],
    "pemerintahan.struktur-organisasi": ["Pemerintahan"],
    "pemerintahan.tugas-dan-fungsi": ["Pemerintahan"],
    "pemerintahan.bupati": ["Pemerintahan"],

    // Berita
    "berita.index": ["Berita"],
    "berita.detail": ["Berita", "berita.index"],
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

    if (routeName === "pemerintahan.transparansi-keuangan-detail" && context.value) {
      return `${context.value}`;
    }

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
