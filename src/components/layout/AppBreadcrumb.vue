<template>
  <div class="row pager-bg">
    <div class="container-fluid pager pager--pict" style="background-image: url(/banner-breadcrumb.png)">
      <div class="row">
        <div class="container">
          <div class="pager-line"></div>
          <p class="pager-title">{{ getTitleFromRoute() }}.</p>
          <RouterLink :to="{ name: 'beranda.index' }" class="pager-link">
            <i class="bx bx-home"></i>
          </RouterLink>
          <template v-for="(item, index) in breadcrumbItems" :key="index">
            <span class="pager-divider"><i class="bx bx-chevron-right"></i></span>
            <template v-if="item.href && item.href !== '#'">
              <RouterLink :to="item.href" class="pager-link" :class="{ active: item.active }">
                {{ item.label }}
              </RouterLink>
            </template>
            <template v-else>
              <span class="pager-link" :class="{ active: item.active }">{{ item.label }}</span>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

import { useBreadcrumb } from "@/composables/useBreadcrumb";

const { breadcrumbItems, getTitleFromRoute } = useBreadcrumb();
</script>
