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

<script setup lang="ts">
import { RouterView } from "vue-router";

import AppFooter from "@/components/layout/AppFooter.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
</script>
