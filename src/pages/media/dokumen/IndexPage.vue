<script lang="ts" setup>
import {
  AlertCircle,
  Calendar,
  Download,
  FileText,
  RefreshCw,
  Search,
  FolderOpen,
  Eye,
  X
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";

import BasePagination from "@/components/base/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { PdfPreviewModal } from "@/components/modals";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import { type ApiResponse } from "@/lib/api/core";
import { getDokumenPublic } from "@/lib/api/services/dokumen";
import { getKategoriDokumenPublic } from "@/lib/api/services/kategoriDokumen";
import type { DokumenListPublicResponse } from "@/lib/api/types/dokumen.types";
import type { KategoriDokumen } from "@/lib/api/types/kategoriDokumen.types";

const { date } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// State
const searchQuery = ref<string>("");
const selectedKategori = ref<number | null>(null);
const showDropdown = ref<boolean>(false);

// PDF Modal
const pdfModalRef = ref<InstanceType<typeof PdfPreviewModal> | null>(null);

const openPdfPreview = (fileUrl: string) => {
  pdfModalRef.value?.open(fileUrl);
};

// Fetch kategori dokumen
const {
  data: kategoriData,
  isLoading: isLoadingKategori,
  fetchData: fetchKategori
} = useFetch<ApiResponse<KategoriDokumen[]>, KategoriDokumen[]>(
  () => getKategoriDokumenPublic(),
  {
    immediate: false,
    extractData: (response) => response.data,
  }
);

// Fetch dokumen data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<DokumenListPublicResponse>,
  DokumenListPublicResponse
>(() => getDokumenPublic({
  page: currentPage.value,
  search: searchQuery.value || undefined,
  kategoriId: selectedKategori.value || undefined
}), {
  immediate: false,
  extractData: (response) => response.data,
});

// Computed
const selectedKategoriName = computed(() => {
  if (!selectedKategori.value || !kategoriData.value) return "Semua Kategori";
  const kategori = kategoriData.value.find(k => k.id === selectedKategori.value);
  return kategori?.nama || "Semua Kategori";
});

const filteredKategori = computed(() => {
  if (!kategoriData.value) return [];
  return kategoriData.value.slice(0, 8); // Limit to 8 for grid display
});

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

const selectKategori = (kategoriId: number | null) => {
  selectedKategori.value = kategoriId;
  currentPage.value = 1; // Reset to first page
  showDropdown.value = false;
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedKategori.value = null;
  currentPage.value = 1;
};

// Debounced search
let searchTimeout: number;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Reset to first page
    fetchData();
  }, 500);
};

// Watchers
watch([currentPage, selectedKategori], () => {
  fetchData();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

watch(searchQuery, () => {
  handleSearch();
});

onMounted(async () => {
  await Promise.all([
    fetchKategori(),
    fetchData()
  ]);

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

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 py-20">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="container relative">
        <div class="mx-auto max-w-4xl text-center text-white">
          <h1 class="mb-6 text-4xl font-bold lg:text-5xl">
            Jaringan Dokumentasi dan Informasi Hukum
          </h1>
          <p class="mb-8 text-xl text-yellow-100">
            Akses mudah terhadap dokumen hukum dan peraturan daerah Kutai Kartanegara
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div class="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div class="text-3xl font-bold">{{ totalItems }}</div>
              <div class="text-yellow-100">Dokumen</div>
            </div>
            <div class="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div class="text-3xl font-bold">{{ kategoriData?.length || 0 }}</div>
              <div class="text-yellow-100">Kategori</div>
            </div>
            <div class="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div class="text-3xl font-bold">24/7</div>
              <div class="text-yellow-100">Akses</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Filter Section -->
        <div class="mb-12">
          <!-- Search Bar -->
          <div class="mb-8">
            <div class="relative mx-auto max-w-2xl">
              <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari dokumen..."
                class="w-full rounded-lg border border-gray-300 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
              />
            </div>
          </div>

          <!-- Kategori Grid -->
          <div v-if="!isLoadingKategori && kategoriData" class="mb-8">
            <h3 class="mb-6 text-center text-xl font-semibold text-gray-900">Kategori Dokumen</h3>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
              <!-- All Categories Card -->
              <button
                @click="selectKategori(null)"
                :class="[
                  'group relative overflow-hidden rounded-lg border-2 p-4 text-center transition-all duration-200',
                  selectedKategori === null
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50'
                ]"
              >
                <FolderOpen class="mx-auto mb-2 h-8 w-8" />
                <div class="text-sm font-medium">Semua</div>
              </button>

              <!-- Category Cards -->
              <button
                v-for="kategori in filteredKategori"
                :key="kategori.id"
                @click="selectKategori(kategori.id)"
                :class="[
                  'group relative overflow-hidden rounded-lg border-2 p-4 text-center transition-all duration-200',
                  selectedKategori === kategori.id
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50'
                ]"
              >
                <FileText class="mx-auto mb-2 h-8 w-8" />
                <div class="text-sm font-medium">{{ kategori.nama }}</div>
              </button>
            </div>
          </div>

          <!-- Active Filters -->
          <div v-if="searchQuery || selectedKategori" class="mb-6 flex flex-wrap items-center gap-2">
            <span class="text-sm text-gray-600">Filter aktif:</span>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800"
            >
              "{{ searchQuery }}"
              <X class="ml-1 h-3 w-3" />
            </button>
            <button
              v-if="selectedKategori"
              @click="selectKategori(null)"
              class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800"
            >
              {{ selectedKategoriName }}
              <X class="ml-1 h-3 w-3" />
            </button>
            <button
              @click="clearFilters"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Hapus semua filter
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
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
            <!-- Document Grid -->
            <div class="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="dokumen in data.data"
                :key="dokumen.id"
                class="group overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <!-- Document Icon & Content -->
                <div class="p-6">
                  <!-- Document Icon -->
                  <div class="mb-4 flex items-center justify-center">
                    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-600/10">
                      <FileText class="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>

                  <!-- Category Badge -->
                  <div v-if="dokumen.kategoriDokumen" class="mb-3 flex justify-center">
                    <span class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      {{ dokumen.kategoriDokumen.nama }}
                    </span>
                  </div>

                  <!-- Date -->
                  <div class="mb-3 flex items-center justify-center text-sm text-gray-500">
                    <Calendar class="mr-2 h-4 w-4" />
                    <span>{{ date(dokumen.createdAt) }}</span>
                  </div>

                  <!-- Document Name -->
                  <h3 class="mb-4 text-center text-lg font-bold text-gray-900 line-clamp-2">
                    {{ dokumen.nama }}
                  </h3>

                  <!-- Source -->
                  <div v-if="dokumen.isi" class="mb-4 text-center text-sm text-gray-600">
                    <span class="font-medium">Sumber:</span> {{ dokumen.isi }}
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2">
                    <button
                      @click="openPdfPreview(dokumen.fileUrl)"
                      class="flex-1 inline-flex items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
                    >
                      <Eye class="mr-2 h-4 w-4" />
                      Preview
                    </button>
                    <a
                      :href="dokumen.fileUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex-1 inline-flex items-center justify-center rounded-lg bg-yellow-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
                    >
                      <Download class="mr-2 h-4 w-4" />
                      Download
                    </a>
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
                <FileText class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Tidak Ada Dokumen</h4>
                <p class="text-yellow-700">Maaf, belum ada dokumen yang tersedia saat ini.</p>
                <button
                  v-if="searchQuery || selectedKategori"
                  @click="clearFilters"
                  class="mt-4 inline-flex items-center rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
                >
                  Hapus Filter
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>

    <!-- PDF Preview Modal -->
    <PdfPreviewModal ref="pdfModalRef" />
  </div>
</template>
