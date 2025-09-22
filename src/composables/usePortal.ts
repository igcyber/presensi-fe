import { computed, ref, watch } from "vue";

import { getPortalMenuPublic } from "@/lib/api/services/portal";
import type { PortalMenuPublic } from "@/lib/api/types/portal.types";

export function usePortal() {
  // Data menu utama
  const data = ref<PortalMenuPublic[]>([]);

  // Loading state
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // State untuk menu yang aktif
  const menuActive = ref<PortalMenuPublic | null>(null); // Menu yang aktif

  // State untuk mengontrol submenu yang terbuka (untuk menu utama)
  const openSubMenu = ref<boolean>(false); // Status submenu yang terbuka

  // State untuk mengontrol submenu yang terbuka
  const openSubMenuId = ref<number | null>(null); // ID menu yang terbuka

  // Computed property untuk mengecek apakah ada submenu yang terbuka
  const hasOpenSubMenu = computed(() => openSubMenuId.value !== null);

  // Fungsi untuk toggle submenu
  const toggleSubMenu = (id: number) => {
    if (openSubMenuId.value === id) {
      openSubMenuId.value = null;
      openSubMenu.value = false;
    } else {
      openSubMenuId.value = id;
      openSubMenu.value = true;
    }
  };

  // Fungsi untuk menutup submenu
  const closeSubMenu = () => {
    openSubMenuId.value = null;
    openSubMenu.value = false;
  };

  const fetchData = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await getPortalMenuPublic();
      data.value = response.data.data as PortalMenuPublic[];
    } catch (err) {
      console.error("Error fetching portal data:", err);
      error.value = "Gagal memuat data portal. Silakan coba lagi.";
    } finally {
      isLoading.value = false;
    }
  };

  watch(openSubMenuId, (newVal) => {
    if (newVal) {
      menuActive.value = data.value.find((dt) => dt.id === newVal) || null;
    } else {
      menuActive.value = null;
    }
  });

  return {
    data,
    menuActive,
    hasOpenSubMenu,
    openSubMenu,
    toggleSubMenu,
    closeSubMenu,
    fetchData,
    isLoading,
    error,
  };
}
