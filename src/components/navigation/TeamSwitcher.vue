<script setup lang="ts">
import type { Component } from "vue";
import { RouterLink } from "vue-router";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

defineProps<{
  team: {
    name: string;
    logo: Component;
    plan: string;
    url: string;
  };
}>();
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        as-child
      >
        <RouterLink :to="team.url">
          <div
            class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
          >
            <component :is="team.logo" class="size-4" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-medium">
              {{ team.name }}
            </span>
            <span class="truncate text-xs">{{ team.plan }}</span>
          </div>
        </RouterLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
