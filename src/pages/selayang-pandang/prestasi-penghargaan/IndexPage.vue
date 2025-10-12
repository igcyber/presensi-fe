<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import BasePagination from "@/components/base/BasePagination.vue";
import SelayangPandang from "@/components/features/selayang-pandang/SelayangPandang.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { usePagination } from "@/composables/usePagination";
import { type ApiResponse } from "@/lib/api/core/apiResponse";
import { getPrestasiPenghargaan } from "@/lib/api/services/selayangPandang";
import type { PrestasiPenghargaanDataPayload } from "@/lib/api/types/selayangPandang.types";

// Constants
const STICKY_HEADER_OFFSET = window.visualViewport?.width && window.visualViewport.width < 1023 ? 190 : 265;

// Composables
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

const { data, isLoading, fetchData, isError, error } = useFetch<
  ApiResponse<PrestasiPenghargaanDataPayload>,
  PrestasiPenghargaanDataPayload
>(() => getPrestasiPenghargaan(currentPage.value), {
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

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="border-portal-green mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p class="text-gray-600">Memuat data...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="mx-auto max-w-2xl">
          <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
            <i class="bx bx-error-circle text-destructive mb-4 text-4xl"></i>
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
            <button
              class="rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              @click="fetchData"
            >
              <i class="bx bx-refresh mr-2"></i>
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="data && data.data">
          <SelayangPandang :title="data.data.nama" :content="data.data.isi" :image="data.data.fotoUrl">
            <template #content>
              <!-- Table Section -->
              <div>
                <div class="mb-6">
                  <h3 class="mb-2 text-xl font-semibold text-gray-900">
                    <i class="bx bx-trophy text-portal-green mr-2"></i>
                    Daftar Prestasi dan Penghargaan
                  </h3>
                  <p class="text-sm text-gray-600">
                    Berikut adalah prestasi dan penghargaan yang telah diraih Kabupaten Kutai Kartanegara
                  </p>
                </div>

                <!-- Table Container -->
                <div ref="tableTarget" class="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
                  <!-- Desktop Table -->
                  <div class="hidden overflow-x-auto md:block">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="w-16 px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                          >
                            No
                          </th>
                          <th
                            scope="col"
                            class="w-24 px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                          >
                            Tahun
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                          >
                            Nama Prestasi
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                          >
                            Keterangan
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white">
                        <tr
                          v-for="(item, index) in data?.prestasis"
                          :key="item.id"
                          class="transition-colors duration-150 hover:bg-gray-50"
                        >
                          <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                            {{ index + 1 + (currentPage - 1) * itemsPerPage }}.
                          </td>
                          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                            <span
                              class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                            >
                              {{ item.tahun }}
                            </span>
                          </td>
                          <td class="px-6 py-4 text-sm font-medium text-gray-900">
                            {{ item.nama }}
                          </td>
                          <td class="px-6 py-4 text-sm text-gray-700">
                            <div class="max-w-none" v-html="item.keterangan"></div>
                          </td>
                        </tr>

                        <!-- Empty State Row -->
                        <tr v-if="data?.prestasis?.length === 0">
                          <td colspan="4" class="px-6 py-12 text-center">
                            <div class="text-gray-400">
                              <i class="bx bx-trophy mb-3 text-4xl"></i>
                              <p class="text-sm">Belum ada data prestasi dan penghargaan</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Mobile Cards -->
                  <div class="space-y-4 p-4 md:hidden">
                    <div
                      v-for="(item, index) in data?.prestasis"
                      :key="item.id"
                      class="rounded border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div class="mb-3 flex items-center justify-between">
                        <span class="text-xs font-medium tracking-wider text-gray-500 uppercase">
                          #{{ index + 1 + (currentPage - 1) * itemsPerPage }}
                        </span>
                        <span
                          class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                        >
                          {{ item.tahun }}
                        </span>
                      </div>

                      <h4 class="mb-2 text-sm font-semibold text-gray-900">
                        {{ item.nama }}
                      </h4>

                      <div class="max-w-none text-sm text-gray-700" v-html="item.keterangan"></div>
                    </div>

                    <!-- Mobile Empty State -->
                    <div v-if="data?.prestasis?.length === 0" class="py-8 text-center">
                      <i class="bx bx-trophy mb-3 text-4xl text-gray-400"></i>
                      <p class="text-sm text-gray-500">Belum ada data prestasi dan penghargaan</p>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div class="flex justify-center">
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
          </SelayangPandang>
        </div>

        <!-- Empty State -->
        <div v-else class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <i class="bx bx-info-circle mb-4 text-4xl text-yellow-600"></i>
            <h4 class="mb-4 text-xl font-semibold text-yellow-600">Data Tidak Ditemukan</h4>
            <p class="text-yellow-700">Maaf, data yang Anda cari tidak tersedia saat ini.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
