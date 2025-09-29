<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { getPerusdaByIdPublic } from "@/lib/api/services/perusda";
import type { PerusdaDetailPublicResponse } from "@/lib/api/types/perusda.types";

const route = useRoute();
const id = Number(route.params.id);

const { setContext, clearContext } = useBreadcrumb();

const { data, isLoading, fetchData, isError, error } = useFetch<
  ApiResponse<PerusdaDetailPublicResponse>,
  PerusdaDetailPublicResponse
>(() => getPerusdaByIdPublic(id), {
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
              :to="{ name: 'unit-kerja.perusahaan-daerah' }"
              class="text-portal-green hover:text-portal-green/80 inline-flex items-center transition-colors duration-200"
            >
              <i class="bx bx-chevron-left mr-1 text-lg"></i>
              Kembali ke Daftar Perusahaan Daerah
            </RouterLink>
          </div>

          <!-- Main Content -->
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Left Sidebar -->
            <div class="lg:col-span-1">
              <div class="space-y-6">
                <!-- Company Logo -->
                <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/50">
                  <img
                    :src="data.fotoUrl"
                    :alt="`Logo ${data.nama}`"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <!-- Contact Information -->
                <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/50">
                  <div class="border-b border-gray-200 px-6 py-4">
                    <h3 class="text-lg font-semibold text-gray-900">
                      <i class="bx bx-phone text-portal-green mr-2"></i>
                      Informasi Kontak
                    </h3>
                  </div>
                  <div class="space-y-4 p-6">
                    <!-- Phone -->
                    <div class="flex items-start space-x-3">
                      <div
                        class="bg-portal-green/10 text-portal-green flex h-8 w-8 items-center justify-center rounded-full"
                      >
                        <i class="bx bx-phone text-sm"></i>
                      </div>
                      <div class="flex-1">
                        <a
                          v-if="data.telepon"
                          :href="`tel:${data.telepon}`"
                          class="text-portal-green hover:text-portal-green/80 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium transition-colors duration-200 hover:bg-green-200"
                        >
                          {{ data.telepon }}
                        </a>
                        <span v-else class="text-gray-400">Telepon tidak tersedia</span>
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="flex items-start space-x-3">
                      <div
                        class="bg-portal-green/10 text-portal-green flex h-8 w-8 items-center justify-center rounded-full"
                      >
                        <i class="bx bx-envelope text-sm"></i>
                      </div>
                      <div class="flex-1">
                        <a
                          v-if="data.email"
                          :href="`mailto:${data.email}`"
                          class="text-portal-green hover:text-portal-green/80 text-sm transition-colors duration-200"
                        >
                          {{ data.email }}
                        </a>
                        <span v-else class="text-gray-400">Email tidak tersedia</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Location Map -->
                <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/50">
                  <div class="border-b border-gray-200 px-6 py-4">
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
                <!-- Company Header -->
                <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50">
                  <div class="mb-4 flex items-center">
                    <i class="bx bx-buildings text-portal-green mr-3 text-2xl"></i>
                    <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">{{ data.nama }}</h1>
                  </div>

                  <!-- Address -->
                  <div class="mb-6">
                    <div class="flex items-start space-x-3">
                      <div
                        class="bg-portal-green/10 text-portal-green flex h-8 w-8 items-center justify-center rounded-full"
                      >
                        <i class="bx bx-map text-sm"></i>
                      </div>
                      <div class="flex-1">
                        <span class="text-gray-600">{{ data.alamat || "Alamat tidak tersedia" }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="max-w-none text-gray-700">Tidak ada deskripsi yang tersedia</div>
                </div>

                <!-- Company Information -->
                <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/50">
                  <div class="border-b border-gray-200 px-6 py-4">
                    <h2 class="text-lg font-semibold text-gray-900">
                      <i class="bx bx-info-circle text-portal-green mr-2"></i>
                      Informasi Perusahaan
                    </h2>
                  </div>

                  <div class="p-6">
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <!-- Company Name -->
                      <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">Nama Perusahaan</label>
                        <p class="text-gray-900">{{ data.nama }}</p>
                      </div>

                      <!-- Phone -->
                      <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">Telepon</label>
                        <p class="text-gray-900">{{ data.telepon || "Tidak tersedia" }}</p>
                      </div>

                      <!-- Email -->
                      <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">Email</label>
                        <p class="text-gray-900">{{ data.email || "Tidak tersedia" }}</p>
                      </div>

                      <!-- Address -->
                      <div class="space-y-2 sm:col-span-2">
                        <label class="text-sm font-medium text-gray-500">Alamat</label>
                        <p class="text-gray-900">{{ data.alamat || "Tidak tersedia" }}</p>
                      </div>
                    </div>
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
