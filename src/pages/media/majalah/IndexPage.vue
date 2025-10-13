<script lang="ts" setup>
import { AlertCircle, BookOpen, Building, Calendar, File, RefreshCw } from "lucide-vue-next";
import { onMounted, watch } from "vue";

import BasePagination from "@/components/base/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import { type ApiResponse } from "@/lib/api/core";
import { getMajalahPublic } from "@/lib/api/services/majalah";
import type { MajalahListPublicResponse } from "@/lib/api/types/majalah.types";

const { date, monthName } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch videos data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<MajalahListPublicResponse>,
  MajalahListPublicResponse
>(() => getMajalahPublic({ page: currentPage.value }), {
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
            <AlertCircle class="text-destructive mx-auto mb-4 h-10 w-10" />
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
            <button
              class="inline-flex items-center rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              @click="fetchData"
            >
              <RefreshCw class="mr-2 h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="data">
          <template v-if="data.data.length > 0">
            <!-- Magazine List -->
            <div class="mb-12 space-y-8">
              <div
                v-for="majalah in data.data"
                :key="majalah.id"
                class="overflow-hidden rounded bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <!-- Magazine Embed -->
                <div class="relative aspect-[16/10] bg-gray-100">
                  <iframe
                    class="h-full w-full"
                    :src="majalah.link"
                    frameborder="0"
                    allowfullscreen
                    loading="lazy"
                  ></iframe>
                </div>

                <!-- Magazine Info -->
                <div class="p-6">
                  <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <!-- Left side: Title and Date -->
                    <div class="flex-1">
                      <!-- Title -->
                      <a
                        :href="majalah.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hover:text-portal-green mb-2 block text-xl font-bold text-gray-900 transition-colors duration-200"
                      >
                        {{ majalah.tahun }} - {{ monthName(majalah.bulan) }}
                      </a>

                      <!-- Date and Source -->
                      <div class="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-4">
                        <div class="flex items-center">
                          <Calendar class="mr-2 h-4 w-4" />
                          <span>{{ date(majalah.createdAt) }}</span>
                        </div>
                        <div class="flex items-center">
                          <Building class="mr-2 h-4 w-4" />
                          <span>Sumber: Diskominfo</span>
                        </div>
                      </div>
                    </div>

                    <!-- Right side: Action Button -->
                    <div class="flex-shrink-0">
                      <a
                        :href="majalah.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="bg-portal-green hover:bg-portal-green/90 flex items-center justify-center rounded-md px-6 py-3 text-white transition-colors duration-200"
                      >
                        <BookOpen class="mr-2 h-4 w-4" />
                        Baca Majalah
                      </a>
                    </div>
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
                <File class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Tidak Ada Majalah</h4>
                <p class="text-yellow-700">Maaf, belum ada majalah yang tersedia saat ini.</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
