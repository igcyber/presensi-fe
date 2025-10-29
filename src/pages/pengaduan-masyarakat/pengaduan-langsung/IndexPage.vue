<script setup lang="ts">
import { AlertCircle, ArrowLeft, Clock, FileText, Globe, RefreshCw, Shield, Users } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { watch } from "vue";

import BasePagination from "@/components/base/BasePagination.vue";
import PengaduanListCard from "@/components/features/pengaduan/PengaduanListCard.vue";
import PengaduanOfflineInfo from "@/components/features/pengaduan/PengaduanOfflineInfo.vue";
import PengaduanOnlineForm from "@/components/features/pengaduan/PengaduanOnlineForm.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { usePagination } from "@/composables/usePagination";
import type { ApiResponse } from "@/lib/api/core";
import { getPengaduanPublic } from "@/lib/api/services/pengaduan";
import type { PengaduanListResponse } from "@/lib/api/types/pengaduan.types";

// Local state
const selectedMode = ref<"online" | "offline" | null>(null);

// Composables
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch pengaduan data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<PengaduanListResponse>,
  PengaduanListResponse
>(() => getPengaduanPublic({ page: currentPage.value }), {
  immediate: false,
  extractData: (response) => response.data,
});

// Pagination methods
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

// Methods
const selectMode = (mode: "online" | "offline") => {
  selectedMode.value = mode;
};

const goBack = () => {
  selectedMode.value = null;
};

const handleSuccess = () => {
  // Reset form after success
  setTimeout(() => {
    selectedMode.value = null;
  }, 3000);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Header -->
        <div v-if="!selectedMode" class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-bold text-gray-900">Pengaduan Langsung</h1>
          <p class="mx-auto max-w-3xl text-lg text-gray-600">
            Pilih cara pengaduan yang sesuai dengan kebutuhan Anda. Kami siap membantu menangani keluhan dan saran Anda.
          </p>
        </div>

        <!-- Back Button -->
        <div v-if="selectedMode" class="mb-6">
          <button
            @click="goBack"
            class="inline-flex items-center text-yellow-600 transition-colors hover:text-yellow-700"
          >
            <ArrowLeft class="mr-2 h-4 w-4" />
            Kembali ke Pilihan
          </button>
        </div>

        <!-- Mode Selection -->
        <div v-if="!selectedMode" class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Pengaduan Online -->
          <div
            @click="selectMode('online')"
            class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-yellow-600/20"
          >
            <div class="p-8 text-center">
              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transition-transform duration-300 group-hover:scale-110"
              >
                <Globe class="h-10 w-10 text-white" />
              </div>

              <h3
                class="mb-3 text-2xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-yellow-600"
              >
                Pengaduan Online
              </h3>

              <p class="mb-6 text-gray-600">
                Kirim pengaduan secara online dengan mudah dan cepat. Formulir akan diproses dalam waktu singkat.
              </p>

              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center justify-center space-x-2">
                  <Clock class="h-4 w-4" />
                  <span>Proses cepat</span>
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <Shield class="h-4 w-4" />
                  <span>Aman dan terpercaya</span>
                </div>
              </div>
            </div>

            <!-- Hover Effect -->
            <div
              class="absolute inset-0 rounded-2xl bg-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-5"
            ></div>

            <!-- Arrow Icon -->
            <div
              class="absolute right-4 bottom-4 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-white">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Pengaduan Offline -->
          <div
            @click="selectMode('offline')"
            class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-yellow-600/20"
          >
            <div class="p-8 text-center">
              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg transition-transform duration-300 group-hover:scale-110"
              >
                <Users class="h-10 w-10 text-white" />
              </div>

              <h3
                class="mb-3 text-2xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-yellow-600"
              >
                Pengaduan Offline
              </h3>

              <p class="mb-6 text-gray-600">
                Kunjungi kantor DPRD untuk pengaduan langsung. Dapatkan bantuan langsung dari petugas yang berwenang.
              </p>

              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center justify-center space-x-2">
                  <FileText class="h-4 w-4" />
                  <span>Bantuan langsung</span>
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <Users class="h-4 w-4" />
                  <span>Interaksi personal</span>
                </div>
              </div>
            </div>

            <!-- Hover Effect -->
            <div
              class="absolute inset-0 rounded-2xl bg-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-5"
            ></div>

            <!-- Arrow Icon -->
            <div
              class="absolute right-4 bottom-4 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-white">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Online Form -->
        <PengaduanOnlineForm v-if="selectedMode === 'online'" @success="handleSuccess" />

        <!-- Offline Info -->
        <PengaduanOfflineInfo v-if="selectedMode === 'offline'" />

        <!-- Pengaduan List Section -->
        <div class="mt-16">
          <div class="mb-8 text-center">
            <h2 class="mb-4 text-3xl font-bold text-gray-900">Pengaduan Terbaru</h2>
            <p class="mx-auto max-w-2xl text-lg text-gray-600">
              Lihat pengaduan-pengaduan yang telah disampaikan oleh masyarakat dan status penanganannya.
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
              <p class="text-gray-600">Memuat pengaduan...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="isError" class="mx-auto max-w-2xl">
            <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
              <AlertCircle class="text-destructive mx-auto mb-4 h-10 w-10" />
              <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
              <p class="mb-6 text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat pengaduan" }}</p>
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
              <!-- Pengaduan Grid -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <PengaduanListCard v-for="pengaduan in data.data" :key="pengaduan.id" :pengaduan="pengaduan" />
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="mt-8 flex justify-center">
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
                  <FileText class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
                  <h4 class="mb-4 text-xl font-semibold text-yellow-600">Belum Ada Pengaduan</h4>
                  <p class="text-yellow-700">
                    Belum ada pengaduan yang tersedia saat ini. Jadilah yang pertama untuk menyampaikan pengaduan Anda.
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
