import { computed, ref, watch } from "vue";

import { getPortalMenu, type PortalMenu } from "@/lib/api/portalMenu";

export function usePortal() {
  // Data menu utama
  const menus = ref<PortalMenu[]>([]);

  // Data container menu untuk submenu
  const containerMenus = ref<PortalMenu[]>([]);

  // State untuk menu yang aktif
  const menuActive = ref<PortalMenu | null>(null); // Menu yang aktif

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
    const response = await getPortalMenu();
    menus.value = response.data.menu;
    containerMenus.value = response.data.containermenu;
  };

  watch(openSubMenuId, (newVal) => {
    if (newVal) {
      menuActive.value = menus.value.find((menu) => menu.id === newVal) || null;
    } else {
      menuActive.value = null;
    }
  });

  return {
    menus,
    containerMenus,
    menuActive,
    hasOpenSubMenu,
    openSubMenu,
    toggleSubMenu,
    closeSubMenu,
    fetchData,
  };
}
