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
        <div v-else-if="data">
          <div class="col-md-12">
            <div class="table-responsive">
              <table id="myTable" ref="tableTarget" class="table-striped table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Dokumen</th>
                    <th>Dokumen Transparansi Keuangan</th>
                    <th>Tanggal Publikasi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in data?.dokumenkeuangans" :key="item.id">
                    <th>{{ index + 1 + (currentPage - 1) * itemsPerPage }}.</th>
                    <td>{{ item.nama }}</td>
                    <td>
                      <RouterLink
                        class="btn btn-sm btn-success"
                        :to="{ name: 'pemerintahan.transparansi-keuangan-detail', params: { id: item.id } }"
                        >LIHAT DATA</RouterLink
                      >
                    </td>
                    <td>{{ formatters.date(item.tanggalPublikasi) }}</td>
                  </tr>
                  <tr v-if="data?.dokumenkeuangans?.length === 0">
                    <td colspan="4" class="text-center">Belum ada data transparansi keuangan</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import useFetch from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import {
  getTransparansiKeuangan,
  type TransparansiKeuanganListPayload,
  type TransparansiKeuanganResponse,
} from "@/lib/api/pemerintahan";

// Constants
const STICKY_HEADER_OFFSET = 200;

// Composables
const formatters = useFormatters();

const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

const { data, isLoading, fetchData, isError, error } = useFetch<
  TransparansiKeuanganResponse,
  TransparansiKeuanganListPayload
>(() => getTransparansiKeuangan(currentPage.value), {
  immediate: false,
  extractData: (response) => response.data,
});

// Refs
const tableTarget = ref<HTMLElement | null>(null);

// Methods
const scrollToTable = () => {
  if (tableTarget.value) {
    const y = tableTarget.value.getBoundingClientRect().top + window.scrollY - STICKY_HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

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
  scrollToTable();
});

onMounted(async () => {
  await fetchData();

  setPagination({
    currentPage: data.value?.meta?.current_page || 1,
    totalPages: data.value?.meta?.last_page || 1,
    totalItems: data.value?.meta?.total || 0,
    itemsPerPage: data.value?.meta?.per_page || 10,
  });
});
</script>
