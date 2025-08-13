<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />
  </div>

  <div class="row">
    <div class="container frame2">
      <div class="row">
        <template v-if="dokumens.length > 0">
          <div v-for="dokumen in dokumens" :key="dokumen.id" class="col-md-4">
            <div class="doc">
              <div class="doc-image-frame">
                <div class="doc-content">
                  <i class="bx bx-file doc-file"></i>
                  <span class="doc-date"> <i class="bx bx-calendar"></i> {{ formatters.date(dokumen.created_at) }} </span>
                  <a :href="dokumen.link" target="_blank" class="doc-link">{{ dokumen.judul }}</a>
                  <div class="doc-text">Sumber : diskominfo</div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="col-md-12">
            <div class="alert alert-warning">Data kosong</div>
          </div>
        </template>
        <div class="col-md-12">
          <BasePagination
            :page="currentPage"
            :totalPages="totalPages"
            :itemsPerPage="itemsPerPage"
            :totalItems="totalItems"
            @previousPage="prevPage"
            @nextPage="nextPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";

const formatters = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Data dummy untuk video
const dokumens = ref([
  {
    id: 1,
    judul: "Dokumen 1",
    link: "/static/dokumen1.pdf",
    created_at: new Date("2024-01-15"),
  },
  {
    id: 2,
    judul: "Dokumen 2",
    link: "/static/dokumen1.pdf",
    created_at: new Date("2024-01-12"),
  },
  {
    id: 3,
    judul: "Dokumen 3",
    link: "/static/dokumen1.pdf",
    created_at: new Date("2024-01-10"),
  },
  {
    id: 4,
    judul: "Dokumen 4",
    link: "/static/dokumen1.pdf",
    created_at: new Date("2024-01-12"),
  },
]);

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

onMounted(() => {
  setPagination({
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    itemsPerPage: 10,
  });
});
</script>
