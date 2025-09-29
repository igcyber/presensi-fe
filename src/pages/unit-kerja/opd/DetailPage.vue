<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { getOpdByIdPublic } from "@/lib/api/services/opd";
import type { OpdDetailPublicResponse } from "@/lib/api/types/opd.types";

const route = useRoute();
const id = Number(route.params.id);

const { setContext, clearContext } = useBreadcrumb();

const { data, isLoading, fetchData, isError, error } = useFetch<
  ApiResponse<OpdDetailPublicResponse>,
  OpdDetailPublicResponse & { layanans?: any[] }
>(() => getOpdByIdPublic(id), {
  immediate: false,
  extractData: (response) => response.data,
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
    <!-- Navigation Spacer -->
    <div class="h-26.5 lg:h-47.5 2xl:h-40.5"></div>

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
          <!-- Back Button -->
          <div class="mb-6">
            <RouterLink
              :to="{ name: 'unit-kerja.opd' }"
              class="text-portal-green hover:text-portal-green/80 inline-flex items-center transition-colors duration-200"
            >
              <i class="bx bx-chevron-left mr-1 text-lg"></i>
              Kembali ke Daftar OPD
            </RouterLink>
          </div>

          <!-- Main Content -->
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Left Sidebar -->
            <div class="lg:col-span-1">
              <div class="space-y-6">
                <!-- OPD Logo -->
                <div class="overflow-hidden rounded bg-white shadow-md">
                  <img
                    :src="data.fotoUrl"
                    :alt="`Logo ${data.nama}`"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <!-- Location Map -->
                <div class="overflow-hidden rounded bg-white shadow-md">
                  <div class="border-b border-gray-200 px-4 py-3">
                    <h3 class="text-lg font-semibold text-gray-900">
                      <i class="bx bx-map text-portal-green mr-2"></i>
                      Lokasi
                    </h3>
                  </div>
                  <div class="aspect-[4/3]" v-if="data.maps">
                    <iframe
                      :src="data.maps || ''"
                      class="h-full w-full"
                      style="border: 0"
                      allowfullscreen
                      loading="lazy"
                    ></iframe>
                  </div>
                  <div class="aspect-[4/3]" v-else>
                    <div class="flex h-full items-center justify-center">
                      <i class="bx bx-map-alt text-2xl text-gray-500"></i>
                      <p class="text-sm text-gray-500">Tidak ada peta yang tersedia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main Content Area -->
            <div class="lg:col-span-2">
              <div class="space-y-6">
                <!-- OPD Header -->
                <div class="rounded bg-white p-6 shadow-md">
                  <div class="mb-4 flex items-center">
                    <i class="bx bx-buildings text-portal-green mr-3 text-2xl"></i>
                    <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">{{ data.nama }}</h1>
                  </div>

                  <!-- Description -->
                  <div class="max-w-none text-gray-700" v-html="data.keterangan"></div>

                  <!-- Website Button -->
                  <div class="mt-6">
                    <a
                      :href="data.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
                    >
                      <i class="bx bx-world mr-2"></i>
                      Kunjungi Website
                    </a>
                  </div>
                </div>

                <!-- Related Applications -->
                <div class="rounded bg-white shadow-md">
                  <div class="border-b border-gray-200 px-6 py-4">
                    <h2 class="text-lg font-semibold text-gray-900">
                      <i class="bx bx-devices text-portal-green mr-2"></i>
                      Aplikasi Terkait
                    </h2>
                  </div>

                  <div class="p-6">
                    <template v-if="data.layanans && data.layanans.length > 0">
                      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div
                          v-for="(layanan, index) in data.layanans"
                          :key="layanan.id"
                          class="rounded border border-gray-200 p-4 transition-shadow duration-200 hover:shadow-md"
                        >
                          <!-- App Header -->
                          <div class="mb-3 flex items-center justify-between">
                            <span class="bg-portal-green rounded px-2 py-1 text-xs font-medium text-white">
                              #{{ index + 1 }}
                            </span>
                            <a :href="layanan.alamat" target="_blank" rel="noopener noreferrer" class="flex-shrink-0">
                              <img
                                :src="layanan.logoUrl"
                                :alt="`Logo ${layanan.nama}`"
                                class="h-12 w-12 rounded object-contain"
                                loading="lazy"
                              />
                            </a>
                          </div>

                          <!-- App Info -->
                          <h3 class="mb-2 font-semibold text-gray-900">{{ layanan.nama }}</h3>

                          <div class="mb-3 text-sm text-gray-600" v-html="layanan.keterangan"></div>

                          <!-- App Link -->
                          <a
                            :href="layanan.alamat"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-green-700"
                          >
                            <i class="bx bx-link-external mr-1"></i>
                            Akses Aplikasi
                          </a>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="rounded-md bg-gray-50 p-6 text-center">
                        <i class="bx bx-devices mb-2 text-2xl text-gray-400"></i>
                        <p class="text-sm text-gray-600">Belum ada aplikasi terkait yang tersedia</p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
