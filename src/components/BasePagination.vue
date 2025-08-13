<template>
  <nav class="mt-3">
    <ul class="pagination">
      <li v-if="props.page === 1" class="page-item disabled" aria-disabled="true" aria-label="Previous">
        <span class="page-link" aria-hidden="true">&lsaquo;</span>
      </li>
      <li v-else class="page-item">
        <a class="page-link" @click="onPreviousPage" rel="prev" aria-label="Previous">&lsaquo;</a>
      </li>

      <template v-for="(page, index) in props.totalPages" :key="index">
        <li v-if="Number(page) === props.page" class="page-item active" aria-current="page">
          <span class="page-link">{{ page }}</span>
        </li>
        <li v-else class="page-item">
          <a class="page-link" :href="`#page=${page}`">{{ page }}</a>
        </li>
      </template>

      <li v-if="props.page < props.totalPages" class="page-item">
        <a class="page-link" @click="onNextPage" rel="next" aria-label="Next">&rsaquo;</a>
      </li>
      <li v-else class="page-item disabled" aria-disabled="true" aria-label="Next">
        <span class="page-link" aria-hidden="true">&rsaquo;</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(["previousPage", "nextPage"]);

const onPreviousPage = () => {
  emit("previousPage");
};

const onNextPage = () => {
  emit("nextPage");
};
</script>
