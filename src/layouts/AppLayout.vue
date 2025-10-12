<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import AppFooter from "@/components/layout/partials/AppFooter.vue";
import AppHeader from "@/components/layout/partials/AppHeader.vue";

import { useAppData } from "@/composables/useAppData";

// Fetch navigation menu on app load
const { fetchNavigation } = useAppData();

onMounted(() => {
  fetchNavigation();
});
</script>

<template>
  <div>
    <!-- Header/Navigation -->
    <AppHeader />

    <!-- Main Content with padding for fixed header -->
    <main class="pt-[65px] lg:pt-[115px] xl:pt-[140px]">
      <RouterView />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
