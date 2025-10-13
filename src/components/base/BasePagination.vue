<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed } from "vue";

import { type PaginationItem, usePagination } from "@/composables/usePagination";

interface Props {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 1,
});

const { buildPagination } = usePagination();

const paginationItems = computed(() => {
  return buildPagination(props.totalPages, props.page, 2, 1);
});

const emit = defineEmits(["previousPage", "nextPage", "page"]);

const onPreviousPage = () => {
  emit("previousPage");
};

const onNextPage = () => {
  emit("nextPage");
};

const onPage = (page: PaginationItem) => {
  emit("page", page);
};
</script>

<template>
  <nav v-if="props.totalPages > 1" class="mt-10 flex items-center justify-center" aria-label="Pagination Navigation">
    <div class="flex items-center space-x-1">
      <!-- Previous Button -->
      <button
        v-if="props.page > 1"
        @click="onPreviousPage"
        class="focus:ring-portal-green flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label="Previous page"
      >
        <ChevronLeft class="h-5 w-5" />
      </button>
      <span
        v-else
        class="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-sm font-medium text-gray-300"
        aria-disabled="true"
        aria-label="Previous page (disabled)"
      >
        <ChevronLeft class="h-5 w-5" />
      </span>

      <!-- Page Numbers -->
      <template v-for="(page, index) in paginationItems" :key="index">
        <!-- Ellipsis -->
        <span
          v-if="page === '…'"
          class="flex h-10 w-10 items-center justify-center text-sm font-medium text-gray-400"
          aria-disabled="true"
          aria-label="More pages"
        >
          &hellip;
        </span>

        <!-- Current Page -->
        <span
          v-else-if="Number(page) === props.page"
          class="bg-portal-green border-portal-green flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold text-white shadow-sm"
          aria-current="page"
          :aria-label="`Current page ${page}`"
        >
          {{ page }}
        </span>

        <!-- Other Pages -->
        <button
          v-else
          @click="onPage(page)"
          class="focus:ring-portal-green flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          :aria-label="`Go to page ${page}`"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next Button -->
      <button
        v-if="props.page < props.totalPages"
        @click="onNextPage"
        class="focus:ring-portal-green flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label="Next page"
      >
        <ChevronRight class="h-5 w-5" />
      </button>
      <span
        v-else
        class="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-sm font-medium text-gray-300"
        aria-disabled="true"
        aria-label="Next page (disabled)"
      >
        <ChevronRight class="h-5 w-5" />
      </span>
    </div>
  </nav>
</template>
