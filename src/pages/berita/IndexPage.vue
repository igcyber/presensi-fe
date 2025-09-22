<script setup lang="ts">
import { computed, onMounted } from "vue";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BasePagination from "@/components/base/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import type { ApiResponse } from "@/lib/api/core";
import { getBeritaPublic } from "@/lib/api/services/berita";
import type { BeritaListPublicResponse } from "@/lib/api/types/berita.types";

const route = useRoute();
const router = useRouter();

// Computed
const keyword = computed(() => (route.query.keyword as string) ?? "");

const { date, slugify } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch dokumen data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<BeritaListPublicResponse>,
  BeritaListPublicResponse
>(() => getBeritaPublic({ page: currentPage.value, keyword: keyword.value }), {
  immediate: false,
  extractData: (response) => response.data,
});

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

watch(keyword, async () => {
  await fetchData();

  setPagination({
    currentPage: data.value?.meta?.current_page ?? 1,
    totalPages: data.value?.meta?.last_page ?? 1,
    totalItems: data.value?.meta?.total ?? 0,
    itemsPerPage: data.value?.meta?.per_page ?? 10,
  });
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
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Spacer -->
    <div class="h-26.5 lg:h-40.5"></div>

    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div v-if="keyword" class="mx-auto mb-8 max-w-2xl">
        <div class="border-portal-green bg-portal-green/10 rounded border p-8 text-center">
          <i class="bx bx-search text-portal-green mb-4 text-4xl"></i>
          <h4 class="text-portal-green mb-2 text-xl font-semibold">Pencarian</h4>
          <p class="text-portal-green mb-6">
            {{
              keyword
                ? `Menampilkan hasil pencarian untuk "${keyword}" dengan total ${data?.data.length} berita.`
                : "Maaf, belum ada berita yang tersedia saat ini."
            }}
          </p>
          <button
            @click="router.push({ name: 'berita.index' })"
            class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
          >
            <i class="bx bx-x mr-2"></i>
            Reset Pencarian
          </button>
        </div>
      </div>

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
          <template v-if="data.data.length > 0">
            <!-- News Grid -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="news in data.data"
                :key="news.id"
                class="group overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <!-- News Image -->
                <div class="relative aspect-[16/10] overflow-hidden">
                  <img
                    :src="news.fotoUrl"
                    :alt="news.judul"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  <!-- Image Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  ></div>
                </div>

                <!-- News Content -->
                <div class="p-4">
                  <!-- Date -->
                  <div class="mb-3 flex items-center text-sm text-gray-500">
                    <i class="bx bx-calendar mr-2"></i>
                    <time :datetime="news.createdAt">{{ date(news.createdAt) }}</time>
                  </div>

                  <!-- Title -->
                  <RouterLink
                    :to="{
                      name: 'berita.detail',
                      params: { id: news.id, slug: slugify(news.judul) },
                    }"
                    class="hover:text-portal-green mb-3 block text-lg font-semibold text-gray-900 transition-colors duration-200"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      line-clamp: 2;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                  >
                    {{ news.judul }}
                  </RouterLink>

                  <!-- Excerpt -->
                  <div
                    class="mb-4 text-sm text-gray-600"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      line-clamp: 3;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                    v-html="news.isi.split(' ').slice(0, 15).join(' ') + '...'"
                  ></div>

                  <!-- Read More Button -->
                  <RouterLink
                    :to="{
                      name: 'berita.detail',
                      params: { id: news.id, slug: slugify(news.judul) },
                    }"
                    class="text-portal-green hover:text-portal-green/80 inline-flex items-center text-sm font-medium transition-colors duration-200"
                  >
                    Baca Selengkapnya
                    <i class="bx bx-right-arrow-alt ml-1"></i>
                  </RouterLink>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center">
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
                <i class="bx bx-news mb-4 text-4xl text-yellow-600"></i>
                <h4 class="mb-4 text-xl font-semibold text-yellow-800">Tidak Ada Berita</h4>
                <p class="text-yellow-700">
                  {{
                    keyword
                      ? `Tidak ditemukan berita dengan kata kunci "${keyword}".`
                      : "Maaf, belum ada berita yang tersedia saat ini."
                  }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
