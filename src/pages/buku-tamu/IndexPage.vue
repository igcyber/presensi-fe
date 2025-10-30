<script setup lang="ts">
import { AlertCircle, RefreshCw } from "lucide-vue-next";
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { BukuTamuForm } from "@/components/features/bukuTamu";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { useFetch } from "@/composables/useFetch";
import { getBukuTamuByIdPublic } from "@/lib/api/services/bukuTamu";
import type { BukuTamuDetailResponse } from "@/lib/api/types/bukuTamu.types";

const route = useRoute();
const router = useRouter();

// Get route parameters
const bukuTamuId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

const bukuTamuSlug = computed(() => {
  return route.params.slug as string;
});

// Get route query
const token = computed(() => {
  return route.query.token as string;
});

const { setContext, clearContext } = useBreadcrumb();

// Fetch buku tamu data
const { data, isLoading, isError, fetchData } = useFetch<any, BukuTamuDetailResponse>(
  () => getBukuTamuByIdPublic(bukuTamuId.value, bukuTamuSlug.value, token.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (_error) => {
      toast.error("Gagal memuat data buku tamu");
    },
  },
);

// Update breadcrumb context when data is available
const updateBreadcrumb = () => {
  if (data.value?.judul) {
    setContext(data.value.judul);
  }
};

// Handle form success
const handleSuccess = () => {
  // Redirect to home page after 3 seconds
  setTimeout(() => {
    router.push("/");
  }, 3000);
};

// Lifecycle
onMounted(() => {
  if (bukuTamuId.value > 0 && bukuTamuSlug.value && token.value) {
    fetchData();
  } else {
    toast.error("Parameter buku tamu tidak valid");
    router.push({ name: "not-found" });
  }
});

// Watch for data changes to update breadcrumb
watch(
  () => data.value?.judul,
  () => {
    updateBreadcrumb();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
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
            <p class="text-gray-600">Memuat data buku tamu...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="mx-auto max-w-2xl">
          <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle class="text-destructive mx-auto mb-4 h-10 w-10" />
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ "Terjadi kesalahan saat memuat data buku tamu" }}</p>
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
          <!-- Header -->
          <div class="mb-8 text-center">
            <h1 class="mb-4 text-4xl font-bold text-gray-900">{{ data.judul }}</h1>
            <p class="mx-auto max-w-3xl text-lg text-gray-600">
              Silakan isi form di bawah ini untuk mencatat kunjungan Anda.
            </p>
          </div>

          <!-- Form -->
          <BukuTamuForm :buku-tamu-id="bukuTamuId" @success="handleSuccess" :token="token" />
        </div>
      </div>
    </main>
  </div>
</template>
