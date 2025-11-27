<script setup lang="ts">
import { AlertCircle, ArrowRight, Calendar, Newspaper, RefreshCw, Search, X } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { ref } from "vue";
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
const tag = computed(() => (route.query.tag as string) ?? "");

const { date, slugify } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Helpers
const stripHtml = (html: string | null | undefined): string => {
  if (!html) return "";
  // Hilangkan seluruh tag HTML dan rapikan spasi
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Search state & handlers
const searchTerm = ref<string>(keyword.value);

const onSearch = async () => {
  const term = searchTerm.value?.trim() || "";
  currentPage.value = 1;
  const query: Record<string, string> = {};
  if (term) {
    query.keyword = term;
  }
  // Keep tag if exists when searching
  if (tag.value) {
    query.tag = tag.value;
  }
  await router.push({
    name: "media.berita",
    query,
  });
};

const onResetSearch = async () => {
  searchTerm.value = "";
  currentPage.value = 1;
  const query: Record<string, string> = {};
  // Keep tag if exists when resetting search
  if (tag.value) {
    query.tag = tag.value;
  }
  await router.push({
    name: "media.berita",
    query,
  });
};

const onResetTag = async () => {
  currentPage.value = 1;
  const query: Record<string, string> = {};
  // Keep keyword if exists when resetting tag
  if (keyword.value) {
    query.keyword = keyword.value;
  }
  await router.push({
    name: "media.berita",
    query,
  });
};

const onResetAll = async () => {
  searchTerm.value = "";
  currentPage.value = 1;
  await router.push({ name: "media.berita" });
};

// Fetch berita data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<BeritaListPublicResponse>,
  BeritaListPublicResponse
>(
  () => {
    const params: { page: number; keyword?: string; tag?: string } = {
      page: currentPage.value,
    };
    if (keyword.value) {
      params.keyword = keyword.value;
    }
    if (tag.value) {
      params.tag = tag.value;
    }
    return getBeritaPublic(params);
  },
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

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

// Sync searchTerm with keyword from URL
watch(keyword, (newKeyword) => {
  searchTerm.value = newKeyword;
});

watch([keyword, tag], async () => {
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
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Search Card -->
        <div class="mb-6">
          <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div class="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-50">
                <Search class="h-4 w-4 text-yellow-700" />
              </div>
              <div class="min-w-0">
                <h3 class="truncate text-sm font-semibold text-gray-900">Pencarian Berita</h3>
                <p class="truncate text-xs text-gray-500">Cari berdasarkan judul atau isi berita</p>
              </div>
            </div>
            <div class="p-4">
              <form @submit.prevent="onSearch" class="flex items-center gap-2">
                <div class="relative flex-1">
                  <Search class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    v-model="searchTerm"
                    type="text"
                    placeholder="Cari berita..."
                    class="w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-9 text-sm placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-yellow-600/60 focus:outline-none"
                  />
                  <button
                    v-if="searchTerm"
                    type="button"
                    @click="onResetSearch"
                    class="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Reset pencarian"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  class="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-yellow-600/90"
                >
                  <Search class="mr-2 h-4 w-4" />
                  Cari
                </button>
              </form>
              <p class="mt-2 text-xs text-gray-500">Tekan Enter atau klik Cari untuk memulai pencarian.</p>
            </div>
          </div>
        </div>
        <!-- Active Filters Bar -->
        <div v-if="keyword || tag" class="mb-6 space-y-2">
          <!-- Search Filter -->
          <div
            v-if="keyword"
            class="flex items-center justify-between rounded border border-yellow-200 bg-yellow-50 px-4 py-3"
          >
            <div class="flex items-center gap-2 text-sm text-yellow-800">
              <Search class="h-4 w-4 text-yellow-600" />
              <span>
                Menampilkan hasil untuk "{{ keyword }}"
                <span v-if="tag"> + tag "{{ tag }}"</span>
                — {{ data?.data.length || 0 }} berita
              </span>
            </div>
            <button
              type="button"
              @click="onResetSearch"
              class="inline-flex items-center rounded border border-yellow-300 px-3 py-1.5 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
            >
              <X class="mr-1.5 h-3.5 w-3.5" />
              Reset Pencarian
            </button>
          </div>

          <!-- Tag Filter -->
          <div v-if="tag" class="flex items-center justify-between rounded border border-blue-200 bg-blue-50 px-4 py-3">
            <div class="flex items-center gap-2 text-sm text-blue-800">
              <div class="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-white">
                <span class="text-xs font-semibold">#</span>
              </div>
              <span>
                Filter tag: <strong>"{{ tag }}"</strong>
                <span v-if="keyword"> (dengan pencarian "{{ keyword }}")</span>
              </span>
            </div>
            <button
              type="button"
              @click="onResetTag"
              class="inline-flex items-center rounded border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              <X class="mr-1.5 h-3.5 w-3.5" />
              Reset Tag
            </button>
          </div>

          <!-- Reset All Button (shown when both filters active) -->
          <div v-if="keyword && tag" class="flex justify-end">
            <button
              type="button"
              @click="onResetAll"
              class="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <X class="mr-1.5 h-3.5 w-3.5" />
              Reset Semua Filter
            </button>
          </div>
        </div>
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

                  <!-- Tag Kategori -->
                  <div class="absolute top-2 left-2">
                    <span class="rounded bg-yellow-600 px-2 py-1 text-xs font-semibold text-white uppercase">
                      {{ news.tagRelation?.namaTag || "Umum" }}
                    </span>
                  </div>

                  <!-- Image Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  ></div>
                </div>

                <!-- News Content -->
                <div class="flex flex-col p-4">
                  <!-- Date -->
                  <div class="mb-3 flex items-center text-sm text-gray-500">
                    <Calendar class="mr-2 h-4 w-4" />
                    <time :datetime="news.createdAt">{{ date(news.createdAt) }}</time>
                  </div>

                  <!-- Title -->
                  <RouterLink
                    :to="{
                      name: 'media.berita.detail',
                      params: { id: news.id, slug: slugify(news.judul) },
                    }"
                    class="mb-3 block text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-yellow-600"
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
                    class="mb-4 text-sm leading-relaxed text-gray-600"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      line-clamp: 3;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                  >
                    {{ stripHtml(news.isi) }}
                  </div>

                  <!-- Read More Button -->
                  <RouterLink
                    :to="{
                      name: 'media.berita.detail',
                      params: { id: news.id, slug: slugify(news.judul) },
                    }"
                    class="inline-flex items-center text-sm font-medium transition-colors duration-200 hover:text-yellow-600"
                  >
                    Baca Selengkapnya
                    <ArrowRight class="ml-1 h-4 w-4" />
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
                <Newspaper class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Tidak Ada Berita</h4>
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
