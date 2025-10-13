<script setup lang="ts">
import { AlertCircle, Calendar, Info, RefreshCw, User } from "lucide-vue-next";
import { computed, onMounted } from "vue";

import SelayangPandang from "@/components/features/selayang-pandang/SelayangPandang.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { type ApiResponse } from "@/lib/api/core";
import { getBupati } from "@/lib/api/services/pemerintahan";
import type { BupatiPayload } from "@/lib/api/types/pemerintahan.types";

const { data, isLoading, fetchData, isError, error } = useFetch<ApiResponse<BupatiPayload>, BupatiPayload>(getBupati, {
  immediate: false,
  extractData: (response) => response.data,
});

const bupatiData = computed(() => {
  return data.value?.bupati;
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
        <div v-else-if="bupatiData && bupatiData.length > 0">
          <SelayangPandang title="Bupati & Wakil Bupati Sepanjang Masa">
            <template #other>
              <!-- Grid Responsive untuk Card Bupati -->
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div
                  v-for="(item, index) in bupatiData"
                  :key="index"
                  class="group transform overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <!-- Image Container -->
                  <div class="relative overflow-hidden">
                    <div class="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-200 to-gray-300">
                      <img
                        :src="item.fotoUrl"
                        :alt="`${item.namaBupati} - ${item.namaWakil}`"
                        class="h-48 w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    <!-- Badge Periode -->
                    <div class="absolute top-4 right-4">
                      <div class="bg-portal-green rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md">
                        {{ item.tahunAwal }}-{{ item.tahunAkhir }}
                      </div>
                    </div>
                  </div>

                  <!-- Content Container -->
                  <div class="space-y-4 p-6">
                    <!-- Names -->
                    <div class="space-y-2">
                      <h3
                        class="group-hover:text-portal-green text-lg leading-tight font-bold text-gray-900 transition-colors duration-200"
                      >
                        {{ item.namaBupati }}
                      </h3>
                      <p class="text-base font-medium text-gray-700">
                        {{ item.namaWakil }}
                      </p>
                    </div>

                    <!-- Period Information -->
                    <div class="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar class="text-portal-green h-5 w-5" />
                      <span class="font-medium">Periode:</span>
                      <span class="rounded-md bg-gray-100 px-2 py-1 font-semibold text-gray-800">
                        {{ item.tahunAwal }}/{{ item.tahunAkhir }}
                      </span>
                    </div>

                    <!-- Leadership Type Badge -->
                    <div class="flex flex-wrap gap-2 pt-2">
                      <span
                        class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                      >
                        <User class="mr-1 h-4 w-4" />
                        Bupati & Wakil Bupati
                      </span>
                    </div>
                  </div>

                  <!-- Card Footer dengan Decoration -->
                  <div class="px-6 pb-6">
                    <div class="from-portal-green h-1 w-full rounded-full bg-gradient-to-r to-blue-500"></div>
                  </div>
                </div>
              </div>
            </template>
          </SelayangPandang>
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
