<template>
  <nav v-if="props.totalPages > 1" class="mt-3">
    <ul class="pagination">
      <li v-if="props.page === 1" class="page-item disabled" aria-disabled="true" aria-label="Previous">
        <span class="page-link" aria-hidden="true">&lsaquo;</span>
      </li>
      <li v-else class="page-item">
        <button class="page-link" @click="onPreviousPage" rel="prev" aria-label="Previous">&lsaquo;</button>
      </li>

      <template v-for="(page, index) in paginationItems" :key="index">
        <li v-if="page === '…'" class="page-item disabled" aria-disabled="true" aria-label="Ellipsis">
          <span class="page-link" aria-hidden="true">&hellip;</span>
        </li>
        <li v-else-if="Number(page) === props.page" class="page-item active" aria-current="page">
          <span class="page-link">{{ page }}</span>
        </li>
        <li v-else class="page-item">
          <button class="page-link" @click="onPage(page)">{{ page }}</button>
        </li>
      </template>

      <li v-if="props.page < props.totalPages" class="page-item">
        <button class="page-link" @click="onNextPage" rel="next" aria-label="Next">&rsaquo;</button>
      </li>
      <li v-else class="page-item disabled" aria-disabled="true" aria-label="Next">
        <span class="page-link" aria-hidden="true">&rsaquo;</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
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
