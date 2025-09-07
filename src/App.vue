<script setup lang="ts">
import { RouterView } from "vue-router";

import "vue-sonner/style.css";

import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <!-- Toaster Sonner -->
  <Toaster position="top-right" richColors :close-button="true" :duration="3000" />

  <RouterView />
</template>
