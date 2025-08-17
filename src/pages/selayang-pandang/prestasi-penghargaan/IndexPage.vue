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
        <div v-else-if="contentData">
          <SelayangPandang
            :title="contentData.slug"
            :content="contentData.isi"
            :image="`https://kukarkab.go.id/uploads/${contentData.foto}`"
          >
            <template #content>
              <div ref="tableTarget" class="table-responsive" style="margin-top: -15px">
                <table class="table-striped table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tahun</th>
                      <th>Nama</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in data?.prestasis" :key="item.id">
                      <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}.</td>
                      <td>{{ item.tahun }}</td>
                      <td>{{ item.nama }}</td>
                      <td v-html="item.keterangan"></td>
                    </tr>
                    <tr v-if="data?.prestasis?.length === 0">
                      <td colspan="4" class="text-center">Belum ada data prestasi</td>
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
            </template>
          </SelayangPandang>
        </div>
        <div v-else class="alert alert-warning">
          <p>Data tidak ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import SelayangPandang from "@/components/SelayangPandang.vue";

import useFetch from "@/composables/useFetch";
import { usePagination } from "@/composables/usePagination";
import {
  getPrestasiPenghargaan,
  type PrestasiPenghargaanDataPayload,
  type PrestasiPenghargaanResponse,
} from "@/lib/api/selayangPandang";

// Constants
const STICKY_HEADER_OFFSET = 200;

// Composables
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

const { data, isLoading, fetchData, isError, error } = useFetch<
  PrestasiPenghargaanResponse,
  PrestasiPenghargaanDataPayload
>(() => getPrestasiPenghargaan(currentPage.value), {
  immediate: false,
  extractData: (response) => response.data,
});

// Refs
const tableTarget = ref<HTMLElement | null>(null);

// Computed
const contentData = computed(() => {
  return data.value?.data;
});

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

// Lifecycle
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
