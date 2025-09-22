<script setup lang="ts">
import { computed, onMounted, watch } from "vue";

import BasePagination from "@/components/base/BasePagination.vue";
import SelayangPandang from "@/components/features/selayang-pandang/SelayangPandang.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import { type ApiResponse, type ContentData } from "@/lib/api/core";
import { getOpdPublic } from "@/lib/api/services/opd";
import type { Opd, OpdListPublicResponse } from "@/lib/api/types/opd.types";

// Initialize composables
const formatters = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<OpdListPublicResponse>,
  OpdListPublicResponse
>(() => getOpdPublic({ page: currentPage.value }), {
  immediate: false,
  extractData: (response) => response.data,
});

// Computed properties
const contentData = computed(() => data.value?.data as ContentData);
const opds = computed(() => (data.value?.opds as Opd[]) ?? []);

// Methods
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

// Lifecycle hooks
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
    <!-- Navigation Spacer -->
    <div class="h-26.5 lg:h-40.5"></div>

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
        <div v-else-if="contentData">
          <SelayangPandang :title="contentData.nama" :content="contentData.isi" :image="contentData.fotoUrl">
            <template #other>
              <!-- OPD Grid -->
              <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div
                  v-for="(opd, index) in opds"
                  :key="index"
                  class="group overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div class="flex h-full">
                    <!-- OPD Logo -->
                    <div class="flex w-32 flex-shrink-0 items-center justify-center bg-gray-50 p-4">
                      <img
                        :src="opd.fotoUrl"
                        :alt="`Logo ${opd.nama}`"
                        class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <!-- OPD Content -->
                    <div class="flex flex-1 flex-col p-4">
                      <!-- OPD Name -->
                      <RouterLink
                        :to="{
                          name: 'unit-kerja.opd.detail',
                          params: { id: opd.id, slug: formatters.slugify(opd.nama) },
                        }"
                        class="hover:text-portal-green mb-3 block text-lg font-semibold text-gray-900 transition-colors duration-200"
                        style="
                          display: -webkit-box;
                          -webkit-line-clamp: 2;
                          line-clamp: 2;
                          -webkit-box-orient: vertical;
                          overflow: hidden;
                        "
                      >
                        {{ opd.nama }}
                      </RouterLink>

                      <!-- OPD Info -->
                      <div class="space-y-2 text-sm text-gray-600">
                        <!-- Website -->
                        <div class="flex items-start">
                          <i class="bx bx-globe text-portal-green mt-0.5 mr-2 flex-shrink-0"></i>
                          <a
                            v-if="opd.website"
                            :href="opd.website"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-portal-green hover:text-portal-green/80 break-all transition-colors duration-200"
                          >
                            {{ opd.website }}
                          </a>
                          <span v-else class="text-gray-400">Website tidak tersedia</span>
                        </div>

                        <!-- Address -->
                        <div class="flex items-start">
                          <i class="bx bx-map text-portal-green mt-0.5 mr-2 flex-shrink-0"></i>
                          <span class="break-words">{{ opd.alamat || "Alamat tidak tersedia" }}</span>
                        </div>
                      </div>

                      <!-- Action Button -->
                      <div class="mt-auto pt-4">
                        <RouterLink
                          :to="{
                            name: 'unit-kerja.opd.detail',
                            params: { id: opd.id, slug: formatters.slugify(opd.nama) },
                          }"
                          class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-white transition-colors duration-200"
                        >
                          <i class="bx bx-info-circle mr-2"></i>
                          Lihat Detail
                        </RouterLink>
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
          </SelayangPandang>
        </div>

        <!-- Empty State -->
        <div v-else class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <i class="bx bx-info-circle mb-4 text-4xl text-yellow-600"></i>
            <h4 class="mb-4 text-xl font-semibold text-yellow-800">Data Tidak Ditemukan</h4>
            <p class="text-yellow-700">Maaf, data yang Anda cari tidak tersedia saat ini.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
