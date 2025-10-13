<script setup lang="ts">
import { AlertCircle, FileText, Info, RefreshCw } from "lucide-vue-next";
import { onMounted, ref } from "vue";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getMenuBySlug } from "@/lib/api/services/menu";
import type { MenuBySlugResponse } from "@/lib/api/types/menu.types";

// State
const menuData = ref<MenuBySlugResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Methods
const fetchMenuData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await getMenuBySlug("maklumat-pelayanan-publik");
    menuData.value = response.data;
  } catch (err: any) {
    console.error("Error fetching menu data:", err);
    error.value = err?.response?.data?.message || "Gagal memuat data maklumat pelayanan publik";
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchMenuData();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div
              class="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-600"
            ></div>
            <p class="text-lg text-gray-600">Memuat maklumat pelayanan publik...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="mx-auto max-w-2xl">
          <Card class="border-red-200 bg-red-50/50 shadow-xl backdrop-blur-sm">
            <CardContent class="p-8 text-center">
              <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle class="h-8 w-8 text-red-600" />
              </div>
              <h4 class="mb-4 text-2xl font-bold text-red-800">Terjadi Kesalahan</h4>
              <p class="mb-8 text-red-700">{{ error }}</p>
              <button
                @click="fetchMenuData"
                class="inline-flex items-center rounded-lg bg-red-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-red-700 hover:shadow-xl focus:ring-4 focus:ring-red-300 focus:outline-none"
              >
                <RefreshCw class="mr-2 h-5 w-5" />
                Coba Lagi
              </button>
            </CardContent>
          </Card>
        </div>

        <!-- Content -->
        <div v-else-if="menuData && menuData.page" class="mx-auto max-w-5xl">
          <Card class="overflow-hidden shadow-2xl backdrop-blur-sm">
            <CardHeader class="border-b border-yellow-200 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50">
              <div class="text-center">
                <div
                  class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-600 shadow-lg"
                >
                  <FileText class="h-8 w-8 text-white" />
                </div>
                <CardTitle class="text-3xl font-bold text-gray-800 lg:text-4xl">
                  {{ menuData.nama }}
                </CardTitle>
                <div class="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              </div>
            </CardHeader>
            <CardContent class="p-8 lg:p-12">
              <div
                class="prose prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 max-w-none"
                v-html="menuData.page.content"
              ></div>
            </CardContent>
          </Card>
        </div>

        <!-- No Content State -->
        <div v-else-if="menuData && !menuData.page" class="mx-auto max-w-2xl">
          <Card class="border-yellow-200 bg-yellow-50/50 shadow-xl backdrop-blur-sm">
            <CardContent class="p-8 text-center">
              <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <Info class="h-8 w-8 text-yellow-600" />
              </div>
              <h4 class="mb-4 text-2xl font-bold text-yellow-800">Konten Belum Tersedia</h4>
              <p class="text-yellow-700">Konten untuk halaman ini belum tersedia. Silakan hubungi administrator.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
