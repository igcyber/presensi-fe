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
            :title="visi.nama"
            :content="visi.isi"
            :image="`https://kukarkab.go.id/uploads/${visi.foto}`"
          >
            <template #other>
              <!-- Hero Image -->
              <div
                v-if="misi.foto.split('/')[misi.foto.split('/').length - 1] != 'nopict.jpg'"
                class="mb-8 h-80 w-full overflow-hidden rounded shadow-lg"
              >
                <img
                  :src="`https://kukarkab.go.id/uploads/${misi.foto}`"
                  :alt="misi.nama"
                  class="h-full w-full object-cover"
                />
              </div>

              <!-- Content Header -->
              <div class="mb-4">
                <h1 class="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
                  {{ misi.nama }}
                </h1>
                <div class="text-portal-green flex items-center text-2xl">
                  <i class="bx bx-dots-horizontal-rounded"></i>
                </div>
              </div>

              <!-- Article Content -->
              <div class="max-w-none">
                <article v-html="misi.isi" class="text-justify leading-relaxed text-gray-700"></article>
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

<script setup lang="ts">
import { computed, onMounted } from "vue";

import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import SelayangPandang from "@/components/SelayangPandang.vue";

import useFetch from "@/composables/useFetch";
import { getVisiMisi, type VisiMisiData, type VisiMisiResponse } from "@/lib/api/pemerintahan";

const { data, isLoading, fetchData, isError, error } = useFetch<VisiMisiResponse, VisiMisiData>(getVisiMisi, {
  immediate: false,
  extractData: (response) => response.data,
});
const visi = computed(() => {
  return (data.value as VisiMisiData)?.visi;
});

const misi = computed(() => {
  return (data.value as VisiMisiData)?.misi;
});

onMounted(async () => {
  await fetchData();
});
</script>
