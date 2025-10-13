<script setup lang="ts">
import { AlertCircle, Info, RefreshCw } from "lucide-vue-next";
import { onMounted } from "vue";

import SelayangPandang from "@/components/features/selayang-pandang/SelayangPandang.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { type ApiResponse, type PayloadData } from "@/lib/api/core";
import { getStrukturOrganisasi } from "@/lib/api/services/pemerintahan";
import type { StrukturOrganisasiData } from "@/lib/api/types/pemerintahan.types";

const { data, isLoading, fetchData, isError, error } = useFetch<
  ApiResponse<PayloadData<StrukturOrganisasiData>>,
  StrukturOrganisasiData
>(getStrukturOrganisasi, {
  immediate: false,
  extractData: (response) => response.data.data,
});

onMounted(async () => {
  await fetchData();
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
          <SelayangPandang :title="data.nama" :content="data.isi" :image="data.fotoUrl" />
        </div>

        <!-- Empty State -->
        <div v-else class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <Info class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
            <h4 class="mb-4 text-xl font-semibold text-yellow-600">Data Tidak Ditemukan</h4>
            <p class="text-yellow-700">Maaf, data yang Anda cari tidak tersedia saat ini.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
