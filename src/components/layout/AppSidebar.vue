<script setup lang="ts">
import { ChartBar, HomeIcon, Tag, UserIcon } from "lucide-vue-next";
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
    name: "DPRD",
    logo: HomeIcon,
    plan: "DPRD Beranda",
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
  ],
  navMediaKonten: [
    {
      title: "Tags",
      url: "/app/tags",
      name: "app.tags",
      icon: Tag,
      isActive: routNameActive.value === "app.tags" || routNameActive.value === "app.tags.detail",
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
      <NavGroup label="User & Access Management" :items="data.navUserAccess" />
      <NavGroup label="Media & Konten" :items="data.navMediaKonten" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
