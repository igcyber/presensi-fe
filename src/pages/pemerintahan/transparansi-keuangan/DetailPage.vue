<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { type ApiResponse, type PayloadData } from "@/lib/api/core";
import { getTransparansiKeuanganById } from "@/lib/api/services/pemerintahan";
import type { TransparansiKeuangan } from "@/lib/api/types/pemerintahan.types";

const route = useRoute();
const id = Number(route.params.id);

const { setContext, clearContext } = useBreadcrumb();

const { date } = useFormatters();

const { data, isLoading, fetchData, isError, error } = useFetch<
  ApiResponse<PayloadData<TransparansiKeuangan>>,
  TransparansiKeuangan
>(() => getTransparansiKeuanganById(id), {
  immediate: false,
  extractData: (response) => response.data.data,
});

// Update breadcrumb context ketika data sudah ada
watch(
  () => data.value?.nama,
  (nama) => {
    if (nama) {
      setContext(nama);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await fetchData();
});

onBeforeUnmount(() => {
  // Opsional: bersihkan agar tidak "nyangkut" ke halaman lain
  clearContext();
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
          <!-- Document Details Card -->
          <div class="mx-auto max-w-4xl">
            <div class="overflow-hidden rounded bg-white shadow-md">
              <!-- Header -->
              <div class="from-portal-green to-portal-green/90 border-b border-gray-200 bg-gradient-to-r px-6 py-4">
                <h1 class="text-xl font-semibold text-white md:text-2xl">Detail Dokumen Transparansi Keuangan</h1>
              </div>

              <!-- Content -->
              <div class="p-6">
                <!-- Document Title -->
                <div class="mb-6">
                  <dt class="mb-2 text-sm font-medium text-gray-600">Judul Dokumen</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ data.nama }}</dd>
                </div>

                <!-- Description -->
                <div class="mb-6">
                  <dt class="mb-2 text-sm font-medium text-gray-600">Deskripsi</dt>
                  <dd
                    class="max-w-none text-sm text-gray-700 [&_li]:my-1 [&_li]:marker:text-gray-600 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-decimal [&_ul]:pl-5"
                    v-html="data.isi"
                  ></dd>
                </div>

                <!-- Publication Date -->
                <div class="mb-6">
                  <dt class="mb-2 text-sm font-medium text-gray-600">Tanggal Publikasi</dt>
                  <dd class="flex items-center text-gray-900">
                    <i class="bx bx-calendar text-portal-green mr-2"></i>
                    <time v-if="data.createdAt" :datetime="data.createdAt">
                      {{ date(data.createdAt) }}
                    </time>
                    <span v-else class="text-gray-500">Tanggal tidak tersedia</span>
                  </dd>
                </div>

                <!-- Files & Links -->
                <div class="mb-6">
                  <dt class="mb-3 text-sm font-medium text-gray-600">File & Tautan</dt>
                  <dd class="space-y-3">
                    <!-- File Download -->
                    <div v-if="data.file">
                      <a
                        :href="data.fileUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
                      >
                        <i class="bx bx-download mr-2"></i>
                        Unduh: {{ data.file }}
                      </a>
                    </div>

                    <!-- No files message -->
                    <div v-if="!data.file && !data.isi" class="rounded-md bg-yellow-50 p-3">
                      <div class="flex items-center">
                        <i class="bx bx-info-circle mr-2 text-yellow-600"></i>
                        <span class="text-sm text-yellow-700">Tidak ada file atau tautan yang tersedia</span>
                      </div>
                    </div>
                  </dd>
                </div>

                <!-- Metadata -->
                <div class="rounded bg-gray-50 p-4">
                  <h3 class="mb-2 text-sm font-medium text-gray-600">Informasi Dokumen</h3>
                  <div class="text-xs text-gray-500">
                    Dokumen ini merupakan bagian dari komitmen transparansi keuangan Pemerintah Kabupaten Kutai
                    Kartanegara.
                  </div>
                </div>
              </div>
            </div>
          </div>
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
