<script setup lang="ts">
import { FileText, FolderOpen } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { getKategoriDokumenPublic } from "@/lib/api/services/kategoriDokumen";
import type { KategoriDokumen } from "@/lib/api/types/kategoriDokumen.types";

const router = useRouter();

// Fetch kategori dokumen
const {
  data: kategoriList,
  isLoading,
  error,
  isError,
  fetchData,
} = useFetch<any, KategoriDokumen[]>(() => getKategoriDokumenPublic(), {
  immediate: false,
  extractData: (response) => response.data,
});

// Gradient colors untuk kategori
const gradientColors = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-green-500 to-green-600",
  "from-orange-500 to-orange-600",
  "from-pink-500 to-pink-600",
  "from-indigo-500 to-indigo-600",
  "from-teal-500 to-teal-600",
  "from-red-500 to-red-600",
];

// Background colors untuk kategori
const bgColors = [
  "bg-blue-50",
  "bg-purple-50",
  "bg-green-50",
  "bg-orange-50",
  "bg-pink-50",
  "bg-indigo-50",
  "bg-teal-50",
  "bg-red-50",
];

// Text colors untuk kategori
const textColors = [
  "text-blue-700",
  "text-purple-700",
  "text-green-700",
  "text-orange-700",
  "text-pink-700",
  "text-indigo-700",
  "text-teal-700",
  "text-red-700",
];

// Hover colors untuk kategori
const hoverColors = [
  "hover:bg-blue-100",
  "hover:bg-purple-100",
  "hover:bg-green-100",
  "hover:bg-orange-100",
  "hover:bg-pink-100",
  "hover:bg-indigo-100",
  "hover:bg-teal-100",
  "hover:bg-red-100",
];

// Computed untuk kategori dengan styling
const kategoriWithStyling = computed(() => {
  if (!kategoriList.value) return [];

  return kategoriList.value.map((kategori: KategoriDokumen, index: number) => ({
    ...kategori,
    gradient: gradientColors[index % gradientColors.length],
    bgColor: bgColors[index % bgColors.length],
    textColor: textColors[index % textColors.length],
    hoverColor: hoverColors[index % hoverColors.length],
  }));
});

const navigateToCategory = (kategoriId: number) => {
  router.push({ name: "dokumen.kategori", params: { id: kategoriId.toString() } });
};

// Lifecycle
onMounted(() => {
  fetchData();
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
        <div class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-bold text-gray-900">JDIH Publik</h1>
          <p class="mx-auto max-w-3xl text-lg text-gray-600">
            Akses JDIH publik berdasarkan kategori untuk transparansi dan keterbukaan informasi
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
            <p class="text-gray-600">Memuat kategori JDIH...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="mx-auto max-w-2xl">
          <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
            <FileText class="mx-auto mb-4 h-10 w-10 text-red-600" />
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
            <button
              class="inline-flex items-center rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              @click="fetchData"
            >
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Kategori Dokumen Grid -->
        <div
          v-else-if="kategoriWithStyling.length > 0"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div
            v-for="kategori in kategoriWithStyling"
            :key="kategori.id"
            @click="navigateToCategory(kategori.id)"
            class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-yellow-600/20"
          >
            <!-- Icon Section -->
            <div class="relative p-8 text-center">
              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110"
                :class="kategori.gradient"
              >
                <FileText class="h-10 w-10 text-white" />
              </div>

              <!-- Title -->
              <h3
                class="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-yellow-600"
              >
                {{ kategori.nama }}
              </h3>

              <!-- Description -->
              <p class="text-sm leading-relaxed text-gray-600">
                Klik untuk melihat dokumen dalam kategori {{ kategori.nama }}
              </p>
            </div>

            <!-- Hover Effect Background -->
            <div
              class="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-5"
              :class="kategori.bgColor"
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

        <!-- Empty State -->
        <div v-else class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <FolderOpen class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
            <h4 class="mb-4 text-xl font-semibold text-yellow-600">Belum Ada Kategori JDIH</h4>
            <p class="text-yellow-700">Maaf, belum ada kategori JDIH yang tersedia saat ini.</p>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="mt-16 rounded-2xl bg-gradient-to-r from-yellow-50 to-yellow-100 p-8 text-center">
          <FileText class="mx-auto mb-4 h-12 w-12 text-yellow-600" />
          <h3 class="mb-4 text-2xl font-bold text-gray-900">Tentang JDIH Publik</h3>
          <p class="mx-auto max-w-3xl leading-relaxed text-gray-700">
            JDIH publik adalah JDIH yang dapat diakses oleh masyarakat umum untuk mendukung transparansi dan
            akuntabilitas pemerintahan. JDIH ini mencakup berbagai jenis informasi yang penting untuk kepentingan publik
            dan dapat diunduh secara bebas.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
