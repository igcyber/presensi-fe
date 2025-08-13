<template>
  <div class="content">
    <template v-for="item in navigation" :key="item.path">
      <RouterLink class="content-link" :class="{ active: isActive(item.path) }" :to="item.path">{{ item.title }}</RouterLink>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { type ComputedRef, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { type NavigationItem, useAppData } from "@/composables/useAppData";

const { selayangPandangNavigation, pemerintahanNavigation } = useAppData();

const route = useRoute();

const navigation: ComputedRef<NavigationItem[]> = computed(() => {
  const routeSplit = route.path.split("/");

  if (routeSplit[1] === "selayang-pandang") {
    return selayangPandangNavigation.value;
  } else {
    return pemerintahanNavigation.value;
  }
});

const isActive = (path: string) => {
  return useRoute().path === path;
};
</script>
