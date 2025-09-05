<script setup lang="ts">
import { RouterView } from "vue-router";

import AppFooter from "@/components/layout/partials/AppFooter.vue";
import AppHeader from "@/components/layout/partials/AppHeader.vue";
</script>

<template>
  <div>
    <!-- Header/Navigation -->
    <AppHeader />

    <!-- Main Content -->
    <RouterView />

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
