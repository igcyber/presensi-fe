<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import type { ApiResponse } from "@/lib/api/core";
import { getBeritaSidebar, getBeritaTagsPublic } from "@/lib/api/services/berita";
import type { BeritaSidebar, BeritaTag } from "@/lib/api/types/berita.types";

const { data, isLoading, fetchData, isError, error } = useFetch<ApiResponse<BeritaSidebar[]>, BeritaSidebar[]>(
  () => getBeritaSidebar(),
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

// Fetch tags data
const {
  data: tags,
  isLoading: isLoadingTags,
  fetchData: fetchTags,
  isError: isErrorTags,
  error: errorTags,
} = useFetch<ApiResponse<BeritaTag[]>, BeritaTag[]>(() => getBeritaTagsPublic(), {
  immediate: false,
  extractData: (response) => response.data,
});

const router = useRouter();
const route = useRoute();
const { date, slugify } = useFormatters();

const keyword = ref<string>((route.query.keyword as string) ?? "");

// Computed properties for separating first post and others
const firstPost = computed(() => data.value?.[0]);
const otherPosts = computed(() => data.value?.slice(1) || []);

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
  await fetchTags();
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
          class="cursor-pointer rounded border-l border-gray-200 bg-yellow-600 px-6 py-3 text-white transition-colors hover:bg-yellow-600/90"
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
          <i class="bx bx-news text-yellow-600"></i>
          <span>Berita</span>
          <span class="font-normal text-gray-600">Lainnya</span>
        </h3>
      </div>

      <!-- Loading State -->
      <template v-if="isLoading">
        <div class="flex justify-center py-8">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-yellow-600"></div>
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
        <!-- Featured Post (First Item) -->
        <article v-if="firstPost" class="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <!-- Large Image -->
          <div class="aspect-video overflow-hidden">
            <img :src="firstPost.fotoUrl" :alt="firstPost.judul" class="h-full w-full object-cover" />
          </div>

          <!-- Content -->
          <div class="p-4">
            <!-- Date -->
            <div class="mb-2 flex items-center gap-1 text-xs text-gray-500">
              <i class="bx bx-calendar"></i>
              {{ date(firstPost.createdAt) }}
            </div>

            <!-- Title -->
            <router-link
              :to="{ name: 'media.berita.detail', params: { id: firstPost.id, slug: slugify(firstPost.judul) } }"
              class="block text-base font-bold text-gray-900 transition-colors hover:text-yellow-600"
            >
              {{ firstPost.judul }}
            </router-link>
          </div>
        </article>

        <!-- Other Posts -->
        <div v-if="otherPosts.length" class="space-y-4">
          <article
            v-for="post in otherPosts"
            :key="post.id"
            class="flex gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
          >
            <!-- News Image -->
            <div class="h-16 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-200">
              <img :src="post.fotoUrl" :alt="post.judul" class="h-full w-full object-cover" />
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
                :to="{ name: 'media.berita.detail', params: { id: post.id, slug: slugify(post.judul) } }"
                class="line-clamp-3 block text-sm font-medium text-gray-900 transition-colors hover:text-yellow-600"
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
          <p class="text-sm text-yellow-600">Data tidak tersedia</p>
        </div>
      </template>
    </div>

    <!-- INDEKS+ Section -->
    <div class="rounded border border-gray-200 bg-white p-6 shadow-sm">
      <!-- Header -->
      <div class="mb-6">
        <h3 class="flex items-center gap-2 text-xl font-bold text-gray-800">
          <i class="bx bx-folder text-yellow-600"></i>
          <span>+TAGS</span>
        </h3>
      </div>

      <!-- Loading State -->
      <template v-if="isLoadingTags">
        <div class="flex justify-center py-8">
          <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-yellow-600"></div>
        </div>
      </template>
      <template v-else-if="isErrorTags">
        <div class="rounded border border-red-200 bg-red-50 p-4">
          <h4 class="mb-2 font-semibold text-red-800">Error</h4>
          <p class="mb-3 text-sm text-red-700">{{ errorTags?.message || "Terjadi kesalahan saat memuat data tag" }}</p>
          <button
            class="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
            @click="fetchTags"
          >
            Coba Lagi
          </button>
        </div>
      </template>
      <template v-else-if="tags && tags.length">
        <!-- Tags List -->
        <div class="space-y-3">
          <router-link
            v-for="tag in tags"
            :key="tag.id"
            :to="{ path: '/berita', query: { tag: tag.namaTag } }"
            class="flex items-center justify-between border-b border-gray-100 pb-3 transition-colors hover:text-yellow-600"
          >
            <div class="flex items-center gap-2">
              <i class="bx bx-folder text-gray-400"></i>
              <span class="font-medium uppercase">{{ tag.namaTag }}</span>
            </div>
            <span class="rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-600">
              {{ tag._count?.beritas || 0 }}
            </span>
          </router-link>
        </div>
      </template>
      <template v-else>
        <div class="rounded border border-yellow-200 bg-yellow-50 p-4 text-center">
          <i class="bx bx-info-circle mb-2 text-2xl text-yellow-600"></i>
          <p class="text-sm text-yellow-600">Data tag tidak tersedia</p>
        </div>
      </template>
    </div>
  </div>
</template>
