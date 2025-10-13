<script setup lang="ts">
import { ChevronRight, Home } from "lucide-vue-next";
import { RouterLink } from "vue-router";

import { useBreadcrumb } from "@/composables/useBreadcrumb";

const { breadcrumbItems, getTitleFromRoute } = useBreadcrumb();
</script>

<template>
  <div style="background-image: url(/assets/images/banners/banner-breadcrumb.png)">
    <div class="relative container py-15">
      <!-- Page Title -->
      <h1 class="mb-4 text-4xl font-bold text-white md:text-5xl">{{ getTitleFromRoute() }}.</h1>

      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center space-x-2 text-sm">
        <RouterLink
          :to="{ name: 'beranda.index' }"
          class="flex items-center text-gray-300 transition-colors hover:text-yellow-600"
        >
          <Home class="mr-1 h-4 w-4" />
          Home
        </RouterLink>

        <template v-for="(item, index) in breadcrumbItems" :key="index">
          <span class="text-gray-400">
            <ChevronRight class="h-3 w-3" />
          </span>

          <template v-if="item.href && item.href !== '#'">
            <RouterLink
              :to="item.href"
              class="text-gray-300 transition-colors hover:text-yellow-600"
              :class="{ 'font-medium text-white': item.active }"
            >
              {{ item.label }}
            </RouterLink>
          </template>
          <template v-else>
            <span class="text-gray-300" :class="{ 'font-medium text-yellow-600': item.active }">
              {{ item.label }}
            </span>
          </template></template
        >
      </nav>
    </div>
  </div>
</template>
