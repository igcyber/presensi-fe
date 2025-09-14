<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  rows?: number;
  columns?: number;
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 6,
});
</script>

<template>
  <div class="space-y-4">
    <!-- Header skeleton -->
    <div class="flex items-center justify-between">
      <Skeleton class="h-8 w-48" />
      <Skeleton class="h-10 w-32" />
    </div>

    <!-- Table skeleton -->
    <div class="space-y-3">
      <div v-for="row in rows" :key="row" class="flex items-center space-x-4">
        <Skeleton v-for="col in columns" :key="col" class="h-4 flex-1" />
      </div>
    </div>

    <!-- Pagination skeleton -->
    <div class="flex items-center justify-between">
      <Skeleton class="h-4 w-32" />
      <div class="flex space-x-2">
        <Skeleton v-for="i in 5" :key="i" class="h-8 w-8" />
      </div>
    </div>
  </div>
</template>
