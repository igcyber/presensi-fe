<template>
  <div class="row pager-bg">
    <div class="container-fluid pager pager--pict" style="background-image: url(/banner-breadcrumb.png)">
      <div class="row">
        <div class="container">
          <div class="pager-line"></div>
          <p class="pager-title">{{ currentPageTitle }}.</p>
          <a class="pager-link"><i class="bx bx-home"></i></a>
          <template v-for="(item, index) in breadcrumbItems" :key="index">
            <span class="pager-divider"><i class="bx bx-chevron-right"></i></span>
            <span class="pager-link">{{ item.title }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

interface BreadcrumbItem {
  title: string;
  path: string;
}

const route = useRoute();

// Generate breadcrumb items based on current route
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [];
  const pathSegments = route.path.split("/").filter((segment) => segment);

  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Convert segment to readable title
    const title = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    items.push({
      title,
      path: currentPath,
    });
  });

  return items;
});

// Current page title (similar to $position in Blade)
const currentPageTitle = computed(() => {
  if (breadcrumbItems.value.length > 0) {
    return breadcrumbItems.value[breadcrumbItems.value.length - 1].title;
  }
  return "Beranda";
});
</script>
