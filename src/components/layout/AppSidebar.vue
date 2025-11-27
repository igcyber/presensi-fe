<script setup lang="ts">
import {
  // BookOpen,
  Building2,
  ChartBar,
  // ClipboardCheck,
  // FileText,
  // FolderTree,
  Grid3x3,
  HomeIcon,
  // Image,
  // ListTree,
  // MessageSquare,
  // NewspaperIcon,
  // Settings,
  Shield,
  Store,
  // Smartphone,
  Tag,
  // UserCheck,
  UserIcon,
  // VideoIcon,
} from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";

import NavDashboard from "@/components/navigation/NavDashboard.vue";
import NavGroup from "@/components/navigation/NavGroup.vue";
import NavUser from "@/components/navigation/NavUser.vue";
import TeamSwitcher from "@/components/navigation/TeamSwitcher.vue";
import type { SidebarProps } from "@/components/ui/sidebar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

import { useAuthStore } from "@/stores/authStore";

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
});

const authStore = useAuthStore();
const route = useRoute();

// Computed route name active
const routNameActive = computed(() => {
  return route.name as string;
});

// Computed user data
const userData = computed(() => {
  return {
    fullname: authStore.user?.fullName || "",
    username: authStore.user?.email || "",
    avatar: (authStore.user as unknown as { avatar: string })?.avatar || "",
  };
});

// Computed data untuk navigation dengan active state
const data = computed(() => ({
  teams: {
    name: "KIOS",
    logo: HomeIcon,
    plan: "DISPERINDAG KIOS Management",
    url: "/",
  },
  navDashboard: [
    {
      title: "Dashboard",
      url: "/app/dashboard",
      name: "app.dashboard",
      icon: HomeIcon,
      isActive: routNameActive.value === "app.dashboard",
    },
    {
      title: "Dashboard Data",
      url: "/app/dashboard-data",
      name: "app.dashboard-data",
      icon: ChartBar,
      isActive: routNameActive.value === "app.dashboard-data",
    },
  ],
  navUserAccess: [
    {
      title: "Users",
      url: "/app/users",
      name: "app.user",
      icon: UserIcon,
      isActive: routNameActive.value === "app.user" || routNameActive.value === "app.user.detail",
    },
    {
      title: "Roles",
      url: "/app/roles",
      name: "app.role",
      icon: Shield,
      isActive: routNameActive.value === "app.role" || routNameActive.value === "app.role.detail",
    },
  ],
  navKiosManagement: [
    {
      title: "Pasar",
      url: "/app/pasar",
      name: "app.pasar",
      icon: Building2,
      isActive: routNameActive.value === "app.pasar" || routNameActive.value === "app.pasar.detail",
    },
    {
      title: "Jenis Usaha",
      url: "/app/jenis-usaha",
      name: "app.jenis-usaha",
      icon: Tag,
      isActive: routNameActive.value === "app.jenis-usaha" || routNameActive.value === "app.jenis-usaha.detail",
    },
    {
      title: "Kios",
      url: "/app/kios",
      name: "app.kios",
      icon: Grid3x3,
      isActive: routNameActive.value === "app.kios" || routNameActive.value === "app.kios.detail",
    },
    {
      title: "Pedagang",
      url: "/app/pedagang",
      name: "app.pedagang",
      icon: Store,
      isActive: routNameActive.value === "app.pedagang" || routNameActive.value === "app.pedagang.detail",
    },
  ],
  // navMediaKonten: [
  //   {
  //     title: "Tags",
  //     url: "/app/tags",
  //     name: "app.tags",
  //     icon: Tag,
  //     isActive: routNameActive.value === "app.tags" || routNameActive.value === "app.tags.detail",
  //   },
  //   {
  //     title: "Berita",
  //     url: "/app/berita",
  //     name: "app.berita",
  //     icon: NewspaperIcon,
  //     isActive: routNameActive.value === "app.berita" || routNameActive.value === "app.berita.detail",
  //   },
  //   {
  //     title: "Video",
  //     url: "/app/video",
  //     name: "app.video",
  //     icon: VideoIcon,
  //     isActive: routNameActive.value === "app.video" || routNameActive.value === "app.video.detail",
  //   },
  //   {
  //     title: "Foto",
  //     url: "/app/foto",
  //     name: "app.foto",
  //     icon: Image,
  //     isActive: routNameActive.value === "app.foto" || routNameActive.value === "app.foto.detail",
  //   },
  //   {
  //     title: "Infografis",
  //     url: "/app/infografis",
  //     name: "app.infografis",
  //     icon: Image,
  //     isActive: routNameActive.value === "app.infografis" || routNameActive.value === "app.infografis.detail",
  //   },
  // ],
  // navDokumenPeraturan: [
  //   {
  //     title: "JDIH",
  //     url: "/app/dokumen",
  //     name: "app.dokumen",
  //     icon: FileText,
  //     isActive: routNameActive.value === "app.dokumen" || routNameActive.value === "app.dokumen.detail",
  //   },
  //   {
  //     title: "JDIH Kategori",
  //     url: "/app/dokumen-kategori",
  //     name: "app.dokumen-kategori",
  //     icon: FileText,
  //     isActive:
  //       routNameActive.value === "app.dokumen-kategori" || routNameActive.value === "app.dokumen-kategori .detail",
  //   },
  // ],
  // navPelayananPublik: [
  //   {
  //     title: "Pengaduan",
  //     url: "/app/pengaduan",
  //     name: "app.pengaduan",
  //     icon: MessageSquare,
  //     isActive: routNameActive.value === "app.pengaduan" || routNameActive.value === "app.pengaduan.detail",
  //   },
  //   {
  //     title: "Buku Tamu",
  //     url: "/app/buku-tamu",
  //     name: "app.buku-tamu",
  //     icon: BookOpen,
  //     isActive: routNameActive.value === "app.buku-tamu" || routNameActive.value === "app.buku-tamu.detail",
  //   },
  // ],
  navSistemKonfigurasi: [
    // {
    //   title: "Menu",
    //   url: "/app/menu",
    //   name: "app.menu",
    //   icon: ListTree,
    //   isActive: routNameActive.value === "app.menu" || routNameActive.value === "app.menu.detail",
    // },
    // {
    //   title: "Pages",
    //   url: "/app/pages",
    //   name: "app.pages",
    //   icon: FileText,
    //   isActive: routNameActive.value === "app.pages" || routNameActive.value === "app.pages.detail",
    // },
    // {
    //   title: "Statik",
    //   url: "/app/statik",
    //   name: "app.statik",
    //   icon: Settings,
    //   isActive: routNameActive.value === "app.statik" || routNameActive.value === "app.statik.detail",
    // },
  ],
  // navOrganisasi: [
  //   {
  //     title: "Struktur",
  //     url: "/app/struktur",
  //     name: "app.struktur",
  //     icon: FolderTree,
  //     isActive: routNameActive.value === "app.struktur" || routNameActive.value === "app.struktur.detail",
  //   },
  //   {
  //     title: "Jabatan Anggota",
  //     url: "/app/jabatan-anggota",
  //     name: "app.jabatan-anggota",
  //     icon: UserCheck,
  //     isActive: routNameActive.value === "app.jabatan-anggota" || routNameActive.value === "app.jabatan-anggota.detail",
  //   },
  // ],
  // navEvaluasiStandar: [
  //   {
  //     title: "Survei Kepuasan",
  //     url: "/app/survei-kepuasan",
  //     name: "app.survei-kepuasan",
  //     icon: ClipboardCheck,
  //     isActive: routNameActive.value === "app.survei-kepuasan" || routNameActive.value === "app.survei-kepuasan.detail",
  //   },
  //   {
  //     title: "Standar Pelayanan",
  //     url: "/app/standar-pelayanan",
  //     name: "app.standar-pelayanan",
  //     icon: ClipboardCheck,
  //     isActive:
  //       routNameActive.value === "app.standar-pelayanan" || routNameActive.value === "app.standar-pelayanan.detail",
  //   },
  // ],
  // navInformasiPublik: [
  //   {
  //     title: "PPID",
  //     url: "/app/ppid",
  //     name: "app.ppid",
  //     icon: FileText,
  //     isActive: routNameActive.value === "app.ppid" || routNameActive.value === "app.ppid.detail",
  //   },
  //
  //   // {
  //   //   title: "Rapat",
  //   //   url: "/app/rapat",
  //   //   name: "app.rapat",
  //   //   icon: Users,
  //   //   isActive: routNameActive.value === "app.rapat" || routNameActive.value === "app.rapat.detail",
  //   // },
  //   // {
  //   //   title: "Aplikasi Terkait",
  //   //   url: "/app/aplikasi-terkait",
  //   //   name: "app.aplikasi-terkait",
  //   //   icon: Smartphone,
  //   //   isActive:
  //   //     routNameActive.value === "app.aplikasi-terkait" || routNameActive.value === "app.aplikasi-terkait.detail",
  //   // },
  //   // {
  //   //   title: "Majalah",
  //   //   url: "/app/majalah",
  //   //   name: "app.majalah",
  //   //   icon: BookOpen,
  //   //   isActive: routNameActive.value === "app.majalah" || routNameActive.value === "app.majalah.detail",
  //   // },
  //   // {
  //   //   title: "Prestasi",
  //   //   url: "/app/prestasi",
  //   //   name: "app.prestasi",
  //   //   icon: Award,
  //   //   isActive: routNameActive.value === "app.prestasi" || routNameActive.value === "app.prestasi.detail",
  //   // },
  //   // {
  //   //   title: "Perusda",
  //   //   url: "/app/perusda",
  //   //   name: "app.perusda",
  //   //   icon: Building,
  //   //   isActive: routNameActive.value === "app.perusda" || routNameActive.value === "app.perusda.detail",
  //   // },
  //   // {
  //   //   title: "Layanan",
  //   //   url: "/app/layanan",
  //   //   name: "app.layanan",
  //   //   icon: Zap,
  //   //   isActive: routNameActive.value === "app.layanan" || routNameActive.value === "app.layanan.detail",
  //   // },
  //   // {
  //   //   title: "Bupati",
  //   //   url: "/app/bupati",
  //   //   name: "app.bupati",
  //   //   icon: Crown,
  //   //   isActive: routNameActive.value === "app.bupati" || routNameActive.value === "app.bupati.detail",
  //   // },
  //   // {
  //   //   title: "OPD",
  //   //   url: "/app/opd",
  //   //   name: "app.opd",
  //   //   icon: Building,
  //   //   isActive: routNameActive.value === "app.opd" || routNameActive.value === "app.opd.detail",
  //   // },
  //   // {
  //   //   title: "Konten",
  //   //   url: "/app/konten",
  //   //   name: "app.konten",
  //   //   icon: FileEdit,
  //   //   isActive: routNameActive.value === "app.konten" || routNameActive.value === "app.konten.detail",
  //   // },
  //   // {
  //   //   title: "Radio",
  //   //   url: "/app/radio",
  //   //   name: "app.radio",
  //   //   icon: Radio,
  //   //   isActive: routNameActive.value === "app.radio" || routNameActive.value === "app.radio.detail",
  //   // },
  //   // {
  //   //   title: "Portal",
  //   //   url: "/app/portal",
  //   //   name: "app.portal",
  //   //   icon: Globe,
  //   //   isActive: routNameActive.value === "app.portal" || routNameActive.value === "app.portal.detail",
  //   // },
  // ],
}));
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :team="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavDashboard :items="data.navDashboard" />
      <NavGroup label="User & Access Management" :items="data.navUserAccess" />
      <NavGroup label="Kios Management" :items="data.navKiosManagement" />
      <!-- <NavGroup label="Sistem & Konfigurasi" :items="data.navSistemKonfigurasi" /> -->
      <!-- <NavGroup label="Media & Konten" :items="data.navMediaKonten" /> -->
      <!-- <NavGroup label="Dokumen & Peraturan" :items="data.navDokumenPeraturan" /> -->
      <!-- <NavGroup label="Pelayanan Publik" :items="data.navPelayananPublik" /> -->
      <!-- <NavGroup label="Organisasi" :items="data.navOrganisasi" /> -->
      <!-- <NavGroup label="Evaluasi & Standar" :items="data.navEvaluasiStandar" /> -->
      <!-- <NavGroup label="Informasi Publik" :items="data.navInformasiPublik" /> -->
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
