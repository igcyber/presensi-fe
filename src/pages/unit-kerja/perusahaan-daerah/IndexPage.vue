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
            <i class="bx bx-error-circle mb-4 text-4xl text-red-500"></i>
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
          <SelayangPandang
            :title="data.data.slug"
            :content="data.data.isi"
            :image="`https://kukarkab.go.id/uploads/${data.data.foto}`"
          >
            <template #other>
              <template v-if="data.perusdas.length > 0">
                <!-- Perusahaan Daerah Grid -->
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div
                    v-for="perusda in data.perusdas"
                    :key="perusda.id"
                    class="group overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div class="flex h-full">
                      <!-- Company Logo -->
                      <div class="flex w-32 flex-shrink-0 items-center justify-center bg-gray-50 p-4">
                        <img
                          :src="`https://kukarkab.go.id/uploads/${perusda.foto}`"
                          :alt="`Logo ${perusda.nama}`"
                          class="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <!-- Company Content -->
                      <div class="flex flex-1 flex-col p-4">
                        <!-- Company Name -->
                        <RouterLink
                          :to="{ name: 'unit-kerja.perusahaan-daerah' }"
                          class="hover:text-portal-green mb-3 block text-lg font-semibold text-gray-900 transition-colors duration-200"
                          style="
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                          "
                        >
                          {{ perusda.nama }}
                        </RouterLink>

                        <!-- Company Info -->
                        <div class="space-y-2 text-sm text-gray-600">
                          <!-- Phone -->
                          <div class="flex items-start">
                            <i class="bx bx-phone text-portal-green mt-0.5 mr-2 flex-shrink-0"></i>
                            <a
                              v-if="perusda.telepon"
                              :href="`tel:${perusda.telepon}`"
                              class="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 transition-colors duration-200 hover:bg-green-200"
                            >
                              {{ perusda.telepon }}
                            </a>
                            <span v-else class="text-gray-400">Telepon tidak tersedia</span>
                          </div>

                          <!-- Address -->
                          <div class="flex items-start">
                            <i class="bx bx-map text-portal-green mt-0.5 mr-2 flex-shrink-0"></i>
                            <span class="break-words">{{ perusda.alamat || "Alamat tidak tersedia" }}</span>
                          </div>
                        </div>

                        <!-- Action Button -->
                        <div class="mt-auto pt-4">
                          <RouterLink
                            :to="{ name: 'unit-kerja.perusahaan-daerah' }"
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

              <!-- Empty State for no companies -->
              <template v-else>
                <div class="mx-auto max-w-2xl">
                  <div class="rounded border border-blue-200 bg-blue-50 p-8 text-center">
                    <i class="bx bx-buildings mb-4 text-4xl text-blue-600"></i>
                    <h4 class="mb-4 text-xl font-semibold text-blue-800">Tidak Ada Perusahaan Daerah</h4>
                    <p class="text-blue-700">Maaf, belum ada data perusahaan daerah yang tersedia saat ini.</p>
                  </div>
                </div>
              </template>
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

<script setup lang="ts">
import { onMounted, watch } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import SelayangPandang from "@/components/SelayangPandang.vue";

import useFetch from "@/composables/useFetch";
import { usePagination } from "@/composables/usePagination";
import {
  getPerusahaanDaerah,
  type PerusahaanDaerahListPayload,
  type PerusahaanDaerahResponse,
} from "@/lib/api/unitKerja";

const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

const { data, isLoading, error, isError, fetchData } = useFetch<PerusahaanDaerahResponse, PerusahaanDaerahListPayload>(
  () => getPerusahaanDaerah(currentPage.value),
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
