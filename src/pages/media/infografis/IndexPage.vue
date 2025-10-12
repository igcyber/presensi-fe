<script lang="ts" setup>
import { onMounted, watch } from "vue";

import BasePagination from "@/components/base/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import { type ApiResponse } from "@/lib/api/core";
import { getInfografisPublic } from "@/lib/api/services/infografis";
import type { InfografisListPublicResponse } from "@/lib/api/types/infografis.types";

const { date } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch infografis data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<InfografisListPublicResponse>,
  InfografisListPublicResponse
>(() => getInfografisPublic({ page: currentPage.value }), {
  immediate: false,
  extractData: (response) => response.data,
});

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
        <div v-else-if="data">
          <template v-if="data.data.length > 0">
            <!-- Infografis Gallery Grid -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div
                v-for="infografis in data.data"
                :key="infografis.id"
                class="group overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <!-- Infografis Container -->
                <div class="relative aspect-[3/4] overflow-hidden">
                  <img
                    :src="infografis.fileUrl"
                    :alt="infografis.nama"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  <!-- Overlay with View Button -->
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <a
                      :href="infografis.fileUrl"
                      data-lightbox="infografis-gallery"
                      :data-title="infografis.nama"
                      class="flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white/90 p-1 text-gray-900 transition-all duration-200 hover:scale-110 hover:bg-white"
                    >
                      <i class="bx bx-zoom-in text-2xl"></i>
                    </a>
                  </div>
                </div>

                <!-- Infografis Info -->
                <div class="p-4">
                  <!-- Title -->
                  <a
                    :href="infografis.fileUrl"
                    data-lightbox="infografis-gallery-title"
                    :data-title="infografis.nama"
                    class="hover:text-portal-green mb-3 block text-lg font-semibold text-gray-900 transition-colors duration-200"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      line-clamp: 2;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                  >
                    {{ infografis.nama }}
                  </a>

                  <!-- Date -->
                  <div class="flex items-center text-sm text-gray-500">
                    <i class="bx bx-calendar mr-2"></i>
                    <span>{{ date(infografis.createdAt) }}</span>
                  </div>
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
          </template>
          <template v-else>
            <div class="mx-auto max-w-2xl">
              <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
                <i class="bx bx-file-blank mb-4 text-4xl text-yellow-600"></i>
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Tidak Ada Infografis</h4>
                <p class="text-yellow-700">Maaf, belum ada infografis yang tersedia saat ini.</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
