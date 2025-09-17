<script setup lang="ts">
import {
  BookOpen,
  Calendar,
  ChartBar,
  Globe,
  HomeIcon,
  NewspaperIcon,
  UserIcon,
  UserRound,
  VideoIcon,
} from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";

import NavDashboard from "@/components/navigation/NavDashboard.vue";
import NavMaster from "@/components/navigation/NavMaster.vue";
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
    avatar: (authStore.user as unknown as { avatar: string }).avatar || "",
  };
});

// Computed data untuk navigation dengan active state
const data = computed(() => ({
  teams: {
    name: "Portal",
    logo: Globe,
    plan: "Portal Beranda",
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
  navMaster: [
    {
      title: "Users",
      url: "/app/users",
      name: "app.user",
      icon: UserIcon,
      isActive: routNameActive.value === "app.user" || routNameActive.value === "app.user.detail",
    },
    {
      title: "Kegiatan",
      url: "/app/kegiatan",
      name: "app.kegiatan",
      icon: Calendar,
      isActive: routNameActive.value === "app.kegiatan" || routNameActive.value === "app.kegiatan.detail",
    },
    {
      title: "Roles",
      url: "#",
      icon: UserRound,
      isActive: routNameActive.value === "roles.index",
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Berita",
      url: "/app/berita",
      name: "app.berita",
      icon: NewspaperIcon,
      isActive: routNameActive.value === "app.berita" || routNameActive.value === "app.berita.detail",
    },
    {
      title: "Majalah",
      url: "/app/majalah",
      name: "app.majalah",
      icon: BookOpen,
      isActive: routNameActive.value === "app.majalah" || routNameActive.value === "app.majalah.detail",
    },
    {
      title: "Video",
      url: "/app/video",
      name: "app.video",
      icon: VideoIcon,
      isActive: routNameActive.value === "app.video" || routNameActive.value === "app.video.detail",
    },
  ],
}));
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :team="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavDashboard :items="data.navDashboard" />
      <NavMaster :items="data.navMaster" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
