<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import type { ApiResponse } from "@/lib/api/core";
import { type BeritaSidebar, getBeritaSidebar } from "@/lib/api/services/berita";

const { data, isLoading, fetchData, isError, error } = useFetch<ApiResponse<BeritaSidebar[]>, BeritaSidebar[]>(
  () => getBeritaSidebar(),
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

const router = useRouter();
const route = useRoute();
const { date, slugify } = useFormatters();

const keyword = ref<string>((route.query.keyword as string) ?? "");

watch(
  () => route.query.keyword,
  (val) => {
    keyword.value = (val as string) ?? "";
  },
);

const onSearchSubmit = () => {
  const query = keyword.value ? { keyword: keyword.value } : {};
  router.push({ path: "/berita", query });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Search Form -->
    <div class="rounded border border-gray-200 bg-white p-6 shadow-sm">
      <form class="flex flex-wrap gap-2" @submit.prevent="onSearchSubmit">
        <input
          class="flex-1 rounded border border-gray-200 bg-gray-50 px-3 py-3 text-gray-700 placeholder-gray-500 focus:outline-none"
          type="text"
          v-model="keyword"
          name="keyword"
          placeholder="Apa yang ingin anda cari?"
        />
        <button
          class="bg-portal-green hover:bg-portal-green-dark cursor-pointer rounded border-l border-gray-200 px-6 py-3 text-white transition-colors"
          type="submit"
        >
          <i class="bx bx-search"></i>
        </button>
      </form>
    </div>

    <!-- News Section -->
    <div class="rounded border border-gray-200 bg-white p-6 shadow-sm">
      <!-- Section Header -->
      <div class="mb-6">
        <h3 class="flex items-center gap-2 text-xl font-bold text-gray-800">
          <i class="bx bx-news text-portal-green"></i>
          <span>Berita</span>
          <span class="font-normal text-gray-600">Kabupaten</span>
        </h3>
      </div>

      <!-- Loading State -->
      <template v-if="isLoading">
        <div class="flex justify-center py-8">
          <div class="border-portal-green h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      </template>
      <template v-else-if="isError">
        <div class="rounded border border-red-200 bg-red-50 p-4">
          <h4 class="mb-2 font-semibold text-red-800">Error</h4>
          <p class="mb-3 text-sm text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
          <button
            class="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
            @click="fetchData"
          >
            Coba Lagi
          </button>
        </div>
      </template>
      <template v-else-if="data && data.length">
        <div class="space-y-4">
          <article
            v-for="post in data"
            :key="post.id"
            class="flex gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
          >
            <!-- News Image -->
            <div class="h-16 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-200">
              <img
                :src="`https://kukarkab.go.id/uploads/beritas/${post.foto}`"
                :alt="post.judul"
                class="h-full w-full object-cover"
              />
            </div>

            <!-- News Content -->
            <div class="min-w-0 flex-1">
              <!-- Date -->
              <div class="mb-2 flex items-center gap-1 text-xs text-gray-500">
                <i class="bx bx-calendar"></i>
                {{ date(post.createdAt) }}
              </div>

              <!-- Title -->
              <router-link
                :to="{ name: 'berita.detail', params: { id: post.id, slug: slugify(post.judul) } }"
                class="hover:text-portal-green line-clamp-3 block text-sm leading-tight font-medium text-gray-900 transition-colors"
              >
                {{ post.judul }}
              </router-link>
            </div>
          </article>
        </div>
      </template>
      <template v-else>
        <div class="rounded border border-yellow-200 bg-yellow-50 p-4 text-center">
          <i class="bx bx-info-circle mb-2 text-2xl text-yellow-600"></i>
          <p class="text-sm text-yellow-800">Data tidak tersedia</p>
        </div>
      </template>
    </div>
  </div>
</template>
