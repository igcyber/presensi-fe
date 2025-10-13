<script setup lang="ts">
import { AlertCircle, File, FileText, RefreshCw, Search } from "lucide-vue-next";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import type { ApiResponse } from "@/lib/api/core";
import { getMenuBySlug } from "@/lib/api/services/menu";
import type { MenuBySlugResponse } from "@/lib/api/types/menu.types";

const route = useRoute();
const { slugToTitle } = useFormatters();

// Computed
const slug = computed(() => route.params.slug as string);

// Fetch menu data
const { data, isLoading, error, isError, fetchData } = useFetch<ApiResponse<MenuBySlugResponse>, MenuBySlugResponse>(
  () => getMenuBySlug(slug.value),
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

const menuData = computed(() => data.value);

watch(
  slug,
  () => {
    fetchData();
  },
  { immediate: true },
);
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
            <p class="text-gray-600">Memuat konten halaman...</p>
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
        <div v-else-if="menuData">
          <!-- Has Page Content -->
          <Card v-if="menuData.page" class="shadow-lg">
            <CardHeader class="bg-gradient-to-r from-yellow-50 to-yellow-100 py-6">
              <CardTitle class="flex items-center gap-3 text-2xl text-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600">
                  <FileText class="h-5 w-5 text-white" />
                </div>
                {{ menuData.nama }}
              </CardTitle>
            </CardHeader>
            <CardContent class="p-8">
              <div
                class="prose prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-a:text-yellow-600 hover:prose-a:text-yellow-700 max-w-none"
                v-html="menuData.page.content"
              ></div>
            </CardContent>
          </Card>

          <!-- No Page Content -->
          <Card v-else class="shadow-lg">
            <CardHeader class="bg-gradient-to-r from-yellow-50 to-yellow-100">
              <CardTitle class="flex items-center gap-3 text-2xl text-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600">
                  <File class="h-5 w-5 text-white" />
                </div>
                {{ menuData.nama }}
              </CardTitle>
            </CardHeader>
            <CardContent class="p-8">
              <div class="py-12 text-center">
                <div class="mb-4 flex justify-center">
                  <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <File class="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h3 class="mb-2 text-lg font-semibold text-gray-700">Konten Belum Tersedia</h3>
                <p class="mx-auto max-w-md text-gray-600">
                  Konten untuk halaman "{{ menuData.nama }}" sedang dalam proses penyiapan. Silakan kembali lagi nanti
                  atau hubungi administrator untuk informasi lebih lanjut.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Not Found -->
        <div v-else class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <Search class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
            <h4 class="mb-4 text-xl font-semibold text-yellow-600">Halaman Tidak Ditemukan</h4>
            <p class="text-yellow-700">Maaf, halaman "{{ slugToTitle(slug) }}" tidak ditemukan atau tidak tersedia.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
