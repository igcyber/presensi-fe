<script setup lang="ts">
import { Badge, Building2, CalendarCheck, ChartBar, ClipboardCheck, Clock, History, HomeIcon, Tag, UserIcon } from "lucide-vue-next";
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
const data = computed(() => {
  const navAdminDashboard = [
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
  ];
  // Menu Khusus Pegawai
  const navPegawaiPresensi = [
    {
      title: "Presensi",
      url: "/pegawai/absensi",
      name: "pegawai.absensi-harian",
      icon: Clock, // Icon untuk presensi harian
      isActive: routNameActive.value === "pegawai.absensi-harian",
    },
    {
      title: "Rekap Presensi",
      url: "/pegawai/rekap",
      name: "pegawai.rekap-presensi",
      icon: CalendarCheck, // Icon untuk rekap
      isActive: routNameActive.value === "pegawai.rekap-presensi",
    },
    {
      title: "Riwayat Absen",
      url: "/pegawai/riwayat",
      name: "pegawai.riwayat-absen",
      icon: History, // Icon untuk riwayat
      isActive: routNameActive.value === "pegawai.riwayat-absen",
    },
    {
      title: "Pengajuan Tidak Hadir",
      url: "/pegawai/permohonan",
      name: "pegawai.permohonan",
      icon: ClipboardCheck, // Icon untuk permohonan
      isActive: routNameActive.value === "pegawai.permohonan",
    },
  ];

  const navPegawaiManagement = [
    {
      title: "Kantor",
      url: "/app/kantor",
      name: "app.kantor",
      icon: Building2,
      isActive: routNameActive.value === "app.kantor",
    },
    {
      title: "Tipe Pegawai",
      url: "/app/tipe-pegawai",
      name: "app.tipe-pegawai",
      icon: Badge,
      isActive: routNameActive.value === "app.tipe-pegawai",
    },
    {
      title: "Pegawai",
      url: "/app/pegawai",
      name: "app.pegawai",
      icon: UserIcon,
      isActive: routNameActive.value === "app.pegawai" || routNameActive.value === "app.pegawai.detail",
    },
  ];
  return {
    teams: {
      name: "Presensi",
      logo: HomeIcon,
      plan: authStore.isPegawai ? "Portal Pegawai" : "Portal Admin",
      url: authStore.isPegawai ? "/pegawai/absensi" : "/app/dashboard",
    },
    navAdminDashboard,
    navPegawaiPresensi,
    navPegawaiManagement,
  };
});
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :team="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <template v-if="authStore.isPegawai">
        <NavGroup label="Menu Utama" :items="data.navPegawaiPresensi" />
      </template>

      <template v-else-if="authStore.isAdmin">
        <NavDashboard :items="data.navAdminDashboard" />
        <NavGroup label="Master Data" :items="data.navPegawaiManagement" />
        <!-- <NavGroup label="Media & Konten" :items="data.navMediaKonten" /> -->
      </template>

      <div v-else class="flex items-center justify-center p-4">
        <span class="text-muted-foreground">Memuat menu...</span>
      </div>
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
