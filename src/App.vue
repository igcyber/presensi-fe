<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import "vue-sonner/style.css";

import { Toaster } from "@/components/ui/sonner";

import { useMetadata } from "@/composables/useMetadata";
import { useSEO } from "@/composables/useSEO";

// Initialize SEO management
const { loadMetadata, injectStructuredData, getOrganizationStructuredData } = useMetadata();
useSEO();

// Load metadata and inject structured data on mount
onMounted(async () => {
  await loadMetadata();
  const orgData = getOrganizationStructuredData();
  if (orgData) {
    injectStructuredData(orgData);
  }
});
</script>

<template>
  <!-- Toaster Sonner -->
  <Toaster position="top-right" richColors :close-button="true" :duration="3000" />

  <RouterView />
</template>
