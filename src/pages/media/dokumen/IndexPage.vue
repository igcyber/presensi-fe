<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div v-if="isLoading" class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else-if="isError" class="alert alert-danger">
          <h4>Error</h4>
          <p>{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
          <button class="btn btn-primary" @click="fetchData">Coba Lagi</button>
        </div>
        <template v-else-if="data">
          <div class="row">
            <template v-if="data.dokumens.length > 0">
              <div v-for="dokumen in data.dokumens" :key="dokumen.id" class="col-md-4">
                <div class="doc">
                  <div class="doc-image-frame">
                    <div class="doc-content">
                      <i class="bx bx-file doc-file"></i>
                      <span class="doc-date">
                        <i class="bx bx-calendar"></i> {{ formatters.date(dokumen.createdAt) }}
                      </span>
                      <a :href="`https://kukarkab.go.id/uploads/${dokumen.file}`" target="_blank" class="doc-link">{{
                        dokumen.nama
                      }}</a>
                      <div class="doc-text">Sumber : {{ dokumen.isi }}</div>
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
            <div v-if="!isLoading && !isError" class="col-md-12">
              <BasePagination
                :page="currentPage"
                :totalPages="totalPages"
                :itemsPerPage="itemsPerPage"
                :totalItems="totalItems"
                @previousPage="prevPage"
                @nextPage="nextPage"
                @page="onPage"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import useFetch from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import { type DokumenData, type DokumenDataPlayload, type DokumenResponse, getDokumens } from "@/lib/api/media";

const formatters = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch dokumen data
const { data, isLoading, error, isError, fetchData } = useFetch<DokumenResponse, DokumenDataPlayload<DokumenData>>(
  () => getDokumens(currentPage.value),
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

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

const onPage = (page: number) => {
  currentPage.value = page;
};

// Watchers
watch(currentPage, () => {
  fetchData();

  window.scrollTo({ top: 0, behavior: "smooth" });
});

onMounted(async () => {
  await fetchData();

  setPagination({
    currentPage: data.value?.meta?.current_page ?? 1,
    totalPages: data.value?.meta?.last_page ?? 1,
    totalItems: data.value?.meta?.total ?? 0,
    itemsPerPage: data.value?.meta?.per_page ?? 10,
  });
});
</script>
