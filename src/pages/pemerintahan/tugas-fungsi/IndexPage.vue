<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="container frame2">
        <SelayangPandang />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelayangPandang from "@/components/SelayangPandang.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
</script>
