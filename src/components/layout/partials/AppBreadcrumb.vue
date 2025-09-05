<script setup lang="ts">
import { RouterLink } from "vue-router";

import { useBreadcrumb } from "@/composables/useBreadcrumb";

const { breadcrumbItems, getTitleFromRoute } = useBreadcrumb();
</script>

<template>
  <div style="background-image: url(/assets/images/banners/banner-breadcrumb.png)">
    <div class="relative container py-15">
      <!-- Decorative Line -->
      <div
        class="bg-portal-green absolute top-[18%] hidden h-32 w-1 lg:left-[6%] lg:block xl:left-[12%] 2xl:left-[10%]"
      ></div>

      <!-- Page Title -->
      <h1 class="mb-4 text-4xl font-bold text-white md:text-5xl">{{ getTitleFromRoute() }}.</h1>

      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center space-x-2 text-sm">
        <RouterLink
          :to="{ name: 'beranda.index' }"
          class="hover:text-portal-green flex items-center text-gray-300 transition-colors"
        >
          <i class="bx bx-home mr-1"></i>
          Home
        </RouterLink>

        <template v-for="(item, index) in breadcrumbItems" :key="index">
          <span class="text-gray-400">
            <i class="bx bx-chevron-right text-xs"></i>
          </span>

          <template v-if="item.href && item.href !== '#'">
            <RouterLink
              :to="item.href"
              class="hover:text-portal-green text-gray-300 transition-colors"
              :class="{ 'font-medium text-white': item.active }"
            >
              {{ item.label }}
            </RouterLink>
          </template>
          <template v-else>
            <span class="text-gray-300" :class="{ 'text-portal-green font-medium': item.active }">
              {{ item.label }}
            </span>
          </template></template
        >
      </nav>
    </div>
  </div>
</template>
