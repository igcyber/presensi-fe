<script setup lang="ts">
import { computed, onMounted } from "vue";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BasePagination from "@/components/base/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import type { ApiResponse } from "@/lib/api/core";
import { getPPIDKategoriPublic } from "@/lib/api/services/ppid";
import type { PPID, PPIDType } from "@/lib/api/types/ppid.types";

const route = useRoute();
const router = useRouter();

// Computed
const ppidType = computed(() => route.params.type as string);
const keyword = computed(() => (route.query.keyword as string) ?? "");

// Composables
const { date, slugToTitle } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch PPID data
const { data, isLoading, error, isError, fetchData } = useFetch<ApiResponse<PPID[]>, PPID[]>(
  () =>
    getPPIDKategoriPublic(ppidType.value as PPIDType, {
      page: currentPage.value,
      keyword: keyword.value,
    }),
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

watch(keyword, async () => {
  await fetchData();
  setPagination({
    currentPage: 1,
    totalPages: 1,
    totalItems: data.value?.length ?? 0,
    itemsPerPage: 10,
  });
});

watch(ppidType, async () => {
  await fetchData();
  setPagination({
    currentPage: 1,
    totalPages: 1,
    totalItems: data.value?.length ?? 0,
    itemsPerPage: 10,
  });
});

onMounted(async () => {
  await fetchData();
  setPagination({
    currentPage: 1,
    totalPages: 1,
    totalItems: data.value?.length ?? 0,
    itemsPerPage: 10,
  });
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Spacer -->
    <div class="h-26.5 lg:h-47.5 2xl:h-40.5"></div>

    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div v-if="keyword" class="mx-auto mb-8 max-w-2xl">
        <div class="border-portal-green bg-portal-green/10 rounded border p-8 text-center">
          <i class="bx bx-search text-portal-green mb-4 text-4xl"></i>
          <h4 class="text-portal-green mb-2 text-xl font-semibold">Pencarian</h4>
          <p class="text-portal-green mb-6">
            {{
              keyword
                ? `Menampilkan hasil pencarian untuk "${keyword}" dengan total ${data?.length} dokumen PPID.`
                : "Maaf, belum ada dokumen PPID yang tersedia saat ini."
            }}
          </p>
          <button
            @click="router.push({ name: 'ppid.index', params: { type: ppidType } })"
            class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
          >
            <i class="bx bx-x mr-2"></i>
            Reset Pencarian
          </button>
        </div>
      </div>

      <div class="container">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="mb-4 text-3xl font-bold text-gray-900">PPID - {{ slugToTitle(ppidType) }}</h1>
          <p class="text-lg text-gray-600">Akses informasi publik berdasarkan kategori</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="border-portal-green mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p class="text-gray-600">Memuat data PPID...</p>
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
          <template v-if="data.length > 0">
            <!-- PPID Grid -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="ppid in data"
                :key="ppid.id"
                class="group hover:ring-portal-green/20 relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <!-- Modern File Type Header -->
                <div class="relative flex items-center justify-between border-b border-gray-100 p-4">
                  <div class="flex items-center space-x-3">
                    <!-- File Type Icon with Modern Design -->
                    <div
                      v-if="ppid.jenisFile === 'dokumen'"
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-sm"
                    >
                      <i class="bx bx-file-pdf text-lg text-white"></i>
                    </div>
                    <div
                      v-else-if="ppid.jenisFile === 'gambar'"
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-sm"
                    >
                      <i class="bx bx-image text-lg text-white"></i>
                    </div>
                    <div
                      v-else
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"
                    >
                      <i class="bx bx-file text-lg text-white"></i>
                    </div>

                    <!-- File Type Label -->
                    <div>
                      <span
                        v-if="ppid.jenisFile === 'dokumen'"
                        class="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                      >
                        PDF Document
                      </span>
                      <span
                        v-else-if="ppid.jenisFile === 'gambar'"
                        class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                      >
                        Image File
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        Document
                      </span>
                    </div>
                  </div>

                  <!-- Date Badge -->
                  <div class="flex items-center text-xs text-gray-500">
                    <i class="bx bx-calendar mr-1"></i>
                    <time :datetime="ppid.createdAt">{{ date(ppid.createdAt) }}</time>
                  </div>
                </div>

                <!-- PPID Content -->
                <div class="flex flex-col p-4">
                  <!-- Title -->
                  <h3
                    class="hover:text-portal-green mb-3 text-lg font-semibold text-gray-900 transition-colors duration-200"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      line-clamp: 2;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                  >
                    {{ ppid.judul }}
                  </h3>

                  <!-- Category -->
                  <div class="mb-3 flex items-center text-sm text-gray-500">
                    <i class="bx bx-folder mr-2"></i>
                    <span>{{ ppid.subKategori }}</span>
                  </div>

                  <!-- Excerpt -->
                  <div
                    class="mb-4 text-sm text-gray-600"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      line-clamp: 3;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                    v-html="ppid.keterangan"
                  ></div>

                  <!-- Download Button -->
                  <a
                    v-if="ppid.fileUrl"
                    :href="ppid.fileUrl"
                    target="_blank"
                    class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-md"
                  >
                    <i class="bx bx-download mr-2"></i>
                    Download File
                  </a>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center">
              <BasePagination
                :page="currentPage"
                :items-per-page="itemsPerPage"
                :total-items="totalItems"
                :total-pages="totalPages"
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
                <h4 class="mb-4 text-xl font-semibold text-yellow-800">Tidak Ada Dokumen PPID</h4>
                <p class="text-yellow-700">
                  {{
                    keyword
                      ? `Tidak ditemukan dokumen PPID dengan kata kunci "${keyword}".`
                      : "Maaf, belum ada dokumen PPID yang tersedia saat ini."
                  }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
