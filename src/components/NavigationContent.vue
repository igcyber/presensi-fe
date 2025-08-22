<template>
  <div class="mt-10 border-t border-gray-200 pt-8">
    <h3 class="mb-4 text-lg font-semibold text-gray-800">Navigasi Terkait</h3>
    <div class="flex flex-wrap gap-3">
      <template v-for="item in navigation" :key="item.path">
        <RouterLink
          class="hover:text-portal-green hover:border-portal-green inline-block rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50"
          :class="{
            'bg-portal-green border-portal-green hover:bg-portal-green-dark text-white hover:text-white': isActivePath(
              route.path,
              item.path,
            ),
          }"
          :to="item.path"
        >
          {{ item.title }}
        </RouterLink>
      </template>
    </div>
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
