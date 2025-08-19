<template>
  <div class="content">
    <template v-for="item in navigation" :key="item.path">
      <RouterLink
        class="content-link cursor-pointer"
        :class="{ active: isActivePath(route.path, item.path) }"
        :to="item.path"
        >{{ item.title }}</RouterLink
      >
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { type NavigationItem, useAppData } from "@/composables/useAppData";
import { isActivePath } from "@/lib/utils/formatters";

const { selayangPandangNavigation, pemerintahanNavigation, unitKerjaNavigation } = useAppData();

const route = useRoute();

const navigation: ComputedRef<NavigationItem[]> = computed(() => {
  const routeSplit = route.path.split("/");

  if (routeSplit[1] === "selayang-pandang") {
    return selayangPandangNavigation.value;
  } else if (routeSplit[1] === "unit-kerja") {
    return unitKerjaNavigation.value;
  } else {
    return pemerintahanNavigation.value;
  }
});
</script>
