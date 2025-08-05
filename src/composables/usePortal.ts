import { computed, ref, watch } from "vue";

export interface MenuItem {
  id: number;
  judul: string;
  link: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface SubMenuItem {
  id: number;
  judul: string;
  link: string;
  icon?: string;
}

export interface Category {
  id: number;
  judul: string;
  sub: SubMenuItem[];
}

export interface ContainerMenuItem extends MenuItem {
  sub: SubMenuItem[];
  kat: Category[];
}

export function usePortal() {
  // Data menu utama
  const menus = ref<MenuItem[]>([
    {
      id: 3,
      judul: "BUMD",
      link: "#",
      icon: "/icon/bumd.png",
      created_at: "2024-02-20 14:14:34",
      updated_at: "2024-02-20 14:14:34",
    },
    {
      id: 1,
      judul: "Layanan",
      link: "#",
      icon: "/icon/layanan.png",
      created_at: "2024-02-14 06:15:36",
      updated_at: "2024-02-20 14:39:23",
    },
    {
      id: 2,
      judul: "OPD",
      link: "#",
      icon: "/icon/opd.png",
      created_at: "2024-02-14 06:22:21",
      updated_at: "2024-02-20 14:39:33",
    },
    {
      id: 4,
      judul: "Pengaduan",
      link: "https://www.lapor.go.id/instansi/pemerintah-kabupaten-kutai-kartanegara",
      icon: "/icon/pengaduan.png",
      created_at: "2024-02-20 22:49:51",
      updated_at: "2024-02-20 22:49:51",
    },
    {
      id: 5,
      judul: "PPID",
      link: "#",
      icon: "/icon/ppid.png",
      created_at: "2024-02-21 15:40:10",
      updated_at: "2024-02-21 15:40:10",
    },
  ]);

  // Data container menu untuk submenu
  const containerMenus = ref<ContainerMenuItem[]>([
    {
      id: 3,
      judul: "BUMD",
      link: "#",
      icon: "",
      created_at: "2024-02-20 14:14:34",
      updated_at: "2024-02-20 14:14:34",
      sub: [
        {
          id: 1,
          judul: "BUMD Kesehatan",
          link: "https://example.com/bumd-kesehatan",
          icon: "/icon/bumd.png",
        },
        {
          id: 2,
          judul: "BUMD Transportasi",
          link: "https://example.com/bumd-transport",
          icon: "/icon/bumd.png",
        },
      ],
      kat: [
        {
          id: 1,
          judul: "Layanan Kesehatan",
          sub: [
            {
              id: 3,
              judul: "Rumah Sakit",
              link: "https://example.com/rs",
              icon: "/icon/bumd.png",
            },
          ],
        },
      ],
    },
    {
      id: 1,
      judul: "Layanan",
      link: "#",
      icon: "",
      created_at: "2024-02-14 06:15:36",
      updated_at: "2024-02-20 14:39:23",
      sub: [
        {
          id: 4,
          judul: "Layanan Umum",
          link: "https://example.com/layanan-umum",
          icon: "/icon/layanan.png",
        },
      ],
      kat: [],
    },
    {
      id: 2,
      judul: "OPD",
      link: "#",
      icon: "",
      created_at: "2024-02-14 06:22:21",
      updated_at: "2024-02-20 14:39:33",
      sub: [],
      kat: [
        {
          id: 2,
          judul: "Dinas Pendidikan",
          sub: [
            {
              id: 5,
              judul: "Sekolah Dasar",
              link: "https://example.com/sd",
              icon: "",
            },
          ],
        },
      ],
    },
    {
      id: 5,
      judul: "PPID",
      link: "#",
      icon: "",
      created_at: "2024-02-21 15:40:10",
      updated_at: "2024-02-21 15:40:10",
      sub: [],
      kat: [],
    },
  ]);

  // State untuk menu yang aktif
  const menuActive = ref<ContainerMenuItem | null>(null); // Menu yang aktif

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

  watch(openSubMenuId, (newVal) => {
    if (newVal) {
      console.log("newVal", newVal);
      menuActive.value = containerMenus.value.find((menu) => menu.id === newVal) || null;
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
  };
}
