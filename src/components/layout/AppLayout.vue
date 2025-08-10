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

import AppFooter from "./AppFooter.vue";
import AppHeader from "./AppHeader.vue";
</script>
