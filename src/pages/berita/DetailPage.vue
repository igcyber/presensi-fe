<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import BeritaSide from "@/components/features/berita/BeritaSide.vue";
import ShareLink from "@/components/features/media/ShareLink.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import type { ApiResponse } from "@/lib/api/core";
import { getBeritaByIdPublic } from "@/lib/api/services/berita";
import type { BeritaDetailPublicResponse } from "@/lib/api/types/berita.types";

const route = useRoute();

const id = computed(() => {
  return Number(route.params.id);
});

const { setContext, clearContext } = useBreadcrumb();

const { date, getSlugUrl } = useFormatters();

const { data, isLoading, fetchData, isError, error } = useFetch<
  ApiResponse<BeritaDetailPublicResponse>,
  BeritaDetailPublicResponse
>(() => getBeritaByIdPublic(id.value), {
  immediate: false,
  extractData: (response) => response.data,
});

// Update breadcrumb context ketika data sudah ada
watch(
  () => data.value?.judul,
  (judul) => {
    if (judul) {
      setContext(judul);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await fetchData();
});

watch(
  () => id.value,
  (id) => {
    if (id) {
      fetchData();
    }
  },
);

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
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
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
              :to="{ name: 'media.berita' }"
              class="inline-flex items-center transition-colors duration-200 hover:text-yellow-600"
            >
              <i class="bx bx-chevron-left mr-1 text-lg"></i>
              Kembali ke Berita
            </RouterLink>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Article Content -->
            <article class="lg:col-span-2">
              <!-- Featured Image -->
              <div class="mb-6 overflow-hidden rounded">
                <img :src="data?.fotoUrl" :alt="data?.judul" class="h-auto w-full object-cover" loading="lazy" />
              </div>

              <!-- Article Content -->
              <div class="rounded bg-white p-6 shadow-md">
                <!-- Meta Information -->
                <div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div class="flex items-center">
                    <i class="bx bx-calendar mr-2"></i>
                    <time :datetime="data?.createdAt">{{ date(data?.createdAt) }}</time>
                  </div>
                  <div class="flex items-center">
                    <i class="bx bx-show mr-2"></i>
                    <span>{{ data?.views || 0 }} kali dilihat</span>
                  </div>
                </div>

                <!-- Title -->
                <h1 class="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
                  {{ data?.judul }}
                </h1>

                <!-- Content -->
                <div class="max-w-none text-gray-700" v-html="data?.isi"></div>

                <!-- Divider -->
                <hr class="my-8 border-gray-200" />

                <!-- Share Section -->
                <div class="rounded bg-gray-50 p-4">
                  <h3 class="mb-3 text-lg font-semibold text-gray-900">Bagikan Artikel</h3>
                  <ShareLink :url="getSlugUrl('berita', data.id, data.judul)" />
                </div>
              </div>
            </article>

            <!-- Sidebar -->
            <aside class="lg:col-span-1">
              <div class="sticky top-43">
                <BeritaSide />
              </div>
            </aside>
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
