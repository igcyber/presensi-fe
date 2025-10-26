<script setup lang="ts">
import { AlertCircle, Calendar, Download, File, FileText, Folder, RefreshCw } from "lucide-vue-next";
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BasePagination from "@/components/base/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import type { ApiResponse } from "@/lib/api/core";
import { getDokumenByKategoriPublic } from "@/lib/api/services/dokumen";
import { getKategoriDokumenPublic } from "@/lib/api/services/kategoriDokumen";
import type { DokumenListPublicResponse } from "@/lib/api/types/dokumen.types";
import type { KategoriDokumen } from "@/lib/api/types/kategoriDokumen.types";

// Router
const route = useRoute();
const router = useRouter();

// Composables
const { date } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Computed
const kategoriId = computed(() => parseInt(route.params.id as string));
const keyword = computed(() => (route.query.keyword as string) ?? "");

// Fetch kategori dokumen untuk filter
const { data: kategoriList } = useFetch<any, KategoriDokumen[]>(() => getKategoriDokumenPublic(), {
  immediate: true,
  extractData: (response) => response.data,
});

// Fetch dokumen berdasarkan kategori
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<{ dokumen: DokumenListPublicResponse; kategori: KategoriDokumen }>,
  { dokumen: DokumenListPublicResponse; kategori: KategoriDokumen }
>(() => getDokumenByKategoriPublic(kategoriId.value, { page: currentPage.value, search: keyword.value }), {
  immediate: false,
  extractData: (response) => response.data,
});

// Computed data
const dokumens = computed(() => data.value?.dokumen);
const kategori = computed(() => data.value?.kategori);

// Methods
const isActiveCategory = (id: number) => {
  return kategoriId.value === id;
};

const navigateToCategory = (id: number) => {
  router.push({ name: "dokumen.kategori", params: { id: id.toString() } });
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
  window.scrollTo({ top: 0, behavior: "smooth" });
});

watch(keyword, async () => {
  await fetchData();
  setPagination({
    currentPage: 1,
    totalPages: 1,
    totalItems: dokumens.value?.meta?.total ?? 0,
    itemsPerPage: 10,
  });
});

watch(kategoriId, async () => {
  await fetchData();
  setPagination({
    currentPage: 1,
    totalPages: 1,
    totalItems: dokumens.value?.meta?.total ?? 0,
    itemsPerPage: 10,
  });
});

// Lifecycle
onMounted(async () => {
  await fetchData();

  setPagination({
    currentPage: 1,
    totalPages: 1,
    totalItems: dokumens.value?.meta?.total ?? 0,
    itemsPerPage: 10,
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
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="mb-4 text-3xl font-bold text-gray-900">
            {{ kategori?.nama || "JDIH" }}
          </h1>
          <p class="text-lg text-gray-600">Akses JDIH publik berdasarkan kategori</p>
        </div>

        <!-- Category Navigation -->
        <div v-if="kategoriList && kategoriList.length > 0" class="mb-8">
          <div class="mb-4 text-center">
            <h3 class="text-lg font-semibold text-gray-700">Kategori Lainnya</h3>
          </div>
          <div class="flex flex-wrap justify-center gap-3">
            <button
              v-for="kategori in kategoriList"
              :key="kategori.id"
              @click="navigateToCategory(kategori.id)"
              :class="[
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                isActiveCategory(kategori.id)
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700',
              ]"
            >
              <FileText class="h-4 w-4" />
              <span>{{ kategori.nama }}</span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
            <p class="text-gray-600">Memuat data JDIH...</p>
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
          <template v-if="dokumens && dokumens.data.length > 0">
            <!-- Dokumen Grid -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="dokumen in dokumens.data"
                :key="dokumen.id"
                class="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-yellow-600/20"
              >
                <!-- Modern File Type Header -->
                <div class="relative flex items-center justify-between border-b border-gray-100 p-4">
                  <div class="flex items-center space-x-3">
                    <!-- File Type Icon with Modern Design -->
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"
                    >
                      <FileText class="h-5 w-5 text-white" />
                    </div>

                    <!-- File Type Label -->
                    <div>
                      <span
                        class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        Document
                      </span>
                    </div>
                  </div>

                  <!-- Date Badge -->
                  <div class="flex items-center text-xs text-gray-500">
                    <Calendar class="mr-1 h-4 w-4" />
                    <time :datetime="dokumen.createdAt">{{ date(dokumen.createdAt) }}</time>
                  </div>
                </div>

                <!-- Dokumen Content -->
                <div class="flex flex-1 flex-col p-4">
                  <!-- Title -->
                  <h3
                    class="mb-3 text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-yellow-600"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      line-clamp: 2;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                  >
                    {{ dokumen.nama }}
                  </h3>

                  <!-- Category -->
                  <div class="mb-3 flex items-center text-sm text-gray-500">
                    <Folder class="mr-2 h-4 w-4" />
                    <span>{{ dokumen.kategoriDokumen?.nama || "Tidak ada kategori" }}</span>
                  </div>

                  <!-- Excerpt -->
                  <div
                    class="mb-4 flex-1 text-sm text-gray-600"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      line-clamp: 3;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                    v-html="dokumen.isi"
                  ></div>

                  <!-- Download Button - Always at bottom -->
                  <div class="mt-auto">
                    <a
                      v-if="dokumen.fileUrl"
                      :href="dokumen.fileUrl"
                      target="_blank"
                      class="inline-flex w-full items-center justify-center rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-yellow-700 hover:shadow-md"
                    >
                      <Download class="mr-2 h-4 w-4" />
                      Download File
                    </a>
                  </div>
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
                <File class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Tidak Ada JDIH</h4>
                <p class="text-yellow-700">Maaf, belum ada JDIH yang tersedia dalam kategori ini.</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
