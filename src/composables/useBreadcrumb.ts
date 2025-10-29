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
    // Selayang Pandang
    "selayang-pandang.sejarah": "Sejarah",
    "selayang-pandang.kependudukan": "Kependudukan",
    "selayang-pandang.potensi-daerah": "Potensi Daerah",
    "selayang-pandang.prestasi": "Prestasi dan Penghargaan",

    // Media
    "media.berita": "Berita",
    "media.berita.detail": "Detail Berita",
    "media.kegiatan": "Kegiatan",
    "media.video": "Video",
    "media.radio": "Radio",
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

    // Unit Kerja
    "unit-kerja.opd": "OPD",
    "unit-kerja.opd.detail": "Detail OPD",
    "unit-kerja.perusahaan-daerah": "Perusahaan Daerah",

    // JDIH
    "dokumen.index": "JDIH",
    "dokumen.kategori": "Kategori JDIH",

    // PPID
    "ppid.index": "PPID",
    "ppid.kategori": "PPID Kategori",

    // DPRD Kukar
    "dprd-kukar.dynamic": "DPRD Kukar",
    "dprd-kukar.struktur-organisasi": "Struktur Organisasi",

    // Pelayanan Publik
    "pelayanan-publik.survey": "Survey Kepuasan Pelayanan Publik",
    "pelayanan-publik.standar": "Standar Pelayanan",

    // Pengaduan Masyarakat
    "pengaduan-masyarakat.pengaduan-langsung": "Pengaduan Langsung",
    "pengaduan-masyarakat.pengaduan-langsung.detail": "Detail Pengaduan Langsung",

    // Aplikasi & Kontak
    "aplikasi-terkait.index": "Aplikasi Terkait",
    "kontak-kami.index": "Kontak Kami",

    // App
    "app.dashboard": "Dashboard",
    "app.dashboard-data": "Dashboard Data",
    "app.user": "User",
    "app.user.detail": "Detail User",
    "app.berita": "Berita",
    "app.berita.detail": "Detail Berita",
    "app.dokumen": "Dokumen",
    "app.dokumen.detail": "Detail Dokumen",
    "app.majalah": "Majalah",
    "app.majalah.detail": "Detail Majalah",
    "app.video": "Video",
    "app.video.detail": "Detail Video",
    "app.foto": "Foto",
    "app.foto.detail": "Detail Foto",
    "app.prestasi": "Prestasi",
    "app.prestasi.detail": "Detail Prestasi",
    "app.perusda": "Perusahaan Daerah",
    "app.perusda.detail": "Detail Perusahaan Daerah",
    "app.perusahaan-daerah": "Perusahaan Daerah",
    "app.perusahaan-daerah.detail": "Detail Perusahaan Daerah",
    "app.layanan": "Layanan",
    "app.layanan.detail": "Detail Layanan",
    "app.bupati": "Bupati",
    "app.bupati.detail": "Detail Bupati",
    "app.opd": "OPD",
    "app.opd.detail": "Detail OPD",
    "app.konten": "Konten",
    "app.konten.detail": "Detail Konten",
    "app.statik": "Statik",
    "app.statik.detail": "Detail Statik",
    "app.radio": "Radio",
    "app.radio.detail": "Detail Radio",
    "app.portal": "Portal",
    "app.portal.detail": "Detail Portal",
    "app.infografis": "Infografis",
    "app.infografis.detail": "Detail Infografis",
    "app.aplikasi-terkait": "Aplikasi Terkait",
    "app.aplikasi-terkait.detail": "Detail Aplikasi Terkait",
    "app.survei-kepuasan": "Survei Kepuasan",
    "app.survei-kepuasan.detail": "Detail Survei Kepuasan",
    "app.ppid": "PPID",
    "app.ppid.detail": "Detail PPID",
    "app.standar-pelayanan": "Standar Pelayanan",
    "app.standar-pelayanan.detail": "Detail Standar Pelayanan",
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
    "media.berita": ["Media"],
    "media.berita.detail": ["Media", "media.berita"],
    "media.kegiatan": ["Media"],
    "media.video": ["Media"],
    "media.radio": ["Media"],
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

    // Unit Kerja
    "unit-kerja.opd": ["Unit Kerja"],
    "unit-kerja.opd.detail": ["Unit Kerja", "unit-kerja.opd"],
    "unit-kerja.perusahaan-daerah": ["Unit Kerja"],

    // JDIH
    "dokumen.index": ["JDIH"],
    "dokumen.kategori": ["dokumen.index"],

    // PPID
    "ppid.index": [],
    "ppid.kategori": ["ppid.index"],

    // DPRD Kukar
    "dprd-kukar.struktur-organisasi": ["DPRD Kukar"],
    "dprd-kukar.dynamic": ["DPRD Kukar"],

    // Pelayanan Publik
    "pelayanan-publik.survey": ["Pelayanan Publik"],
    "pelayanan-publik.standar": ["Pelayanan Publik"],

    // Pengaduan Masyarakat
    "pengaduan-masyarakat.pengaduan-langsung": ["Pengaduan Masyarakat"],
    "pengaduan-masyarakat.pengaduan-langsung.detail": [
      "Pengaduan Masyarakat",
      "pengaduan-masyarakat.pengaduan-langsung",
    ],

    // Aplikasi & Kontak (no parent)
    "aplikasi-terkait.index": [],
    "kontak-kami.index": [],

    // App
    "app.dashboard": [],
    "app.dashboard-data": [],
    "app.user": ["app.dashboard"],
    "app.user.detail": ["app.dashboard", "app.user"],
    "app.berita": ["app.dashboard"],
    "app.berita.detail": ["app.dashboard", "app.berita"],
    "app.dokumen": ["app.dashboard"],
    "app.dokumen.detail": ["app.dashboard", "app.dokumen"],
    "app.majalah": ["app.dashboard"],
    "app.majalah.detail": ["app.dashboard", "app.majalah"],
    "app.video": ["app.dashboard"],
    "app.video.detail": ["app.dashboard", "app.video"],
    "app.foto": ["app.dashboard"],
    "app.foto.detail": ["app.dashboard", "app.foto"],
    "app.prestasi": ["app.dashboard"],
    "app.prestasi.detail": ["app.dashboard", "app.prestasi"],
    "app.perusda": ["app.dashboard"],
    "app.perusda.detail": ["app.dashboard", "app.perusda"],
    "app.perusahaan-daerah": ["app.dashboard"],
    "app.perusahaan-daerah.detail": ["app.dashboard", "app.perusahaan-daerah"],
    "app.layanan": ["app.dashboard"],
    "app.layanan.detail": ["app.dashboard", "app.layanan"],
    "app.bupati": ["app.dashboard"],
    "app.bupati.detail": ["app.dashboard", "app.bupati"],
    "app.opd": ["app.dashboard"],
    "app.opd.detail": ["app.dashboard", "app.opd"],
    "app.konten": ["app.dashboard"],
    "app.konten.detail": ["app.dashboard", "app.konten"],
    "app.statik": ["app.dashboard"],
    "app.statik.detail": ["app.dashboard", "app.statik"],
    "app.radio": ["app.dashboard"],
    "app.radio.detail": ["app.dashboard", "app.radio"],
    "app.portal": ["app.dashboard"],
    "app.portal.detail": ["app.dashboard", "app.portal"],
    "app.infografis": ["app.dashboard"],
    "app.infografis.detail": ["app.dashboard", "app.infografis"],
    "app.aplikasi-terkait": ["app.dashboard"],
    "app.aplikasi-terkait.detail": ["app.dashboard", "app.aplikasi-terkait"],
    "app.survei-kepuasan": ["app.dashboard"],
    "app.survei-kepuasan.detail": ["app.dashboard", "app.survei-kepuasan"],
    "app.ppid": ["app.dashboard"],
    "app.ppid.detail": ["app.dashboard", "app.ppid"],
    "app.standar-pelayanan": ["app.dashboard"],
    "app.standar-pelayanan.detail": ["app.dashboard", "app.standar-pelayanan"],
  };

  /**
   * Mapping untuk PPID type ke label
   */
  const ppidTypeLabels: Record<string, string> = {
    "informasi-berkala": "Informasi Berkala",
    "informasi-setiap-saat": "Informasi Setiap Saat",
    "informasi-serta-merta": "Informasi Serta Merta",
    "informasi-dikecualikan": "Informasi Dikecualikan",
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

    // Handle jika ada context pemerintahan transparansi keuangan
    if (routeName === "pemerintahan.transparansi-keuangan-detail" && context.value) {
      return `${context.value}`;
    }

    // Handle jika ada context buku tamu
    if (routeName === "buku-tamu.fill" && context.value) {
      return `${context.value}`;
    }

    // Handle dynamic PPID type
    if (routeName === "ppid.kategori" && route.params.type) {
      const typeLabel = ppidTypeLabels[route.params.type as string];
      if (typeLabel) {
        return typeLabel;
      }
    }

    // Handle dynamic DPRD Kukar menu
    if (routeName === "dprd-kukar.dynamic" && route.params.slug) {
      const slug = route.params.slug as string;
      return slugToTitle(slug);
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
