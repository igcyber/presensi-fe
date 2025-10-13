<script lang="ts" setup>
import { AlertCircle, Calendar, File, Play, RefreshCw } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";

import BasePagination from "@/components/base/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import VideoModal from "@/components/modals/VideoModal.vue";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import { type ApiResponse } from "@/lib/api/core";
import { getRadioPublic } from "@/lib/api/services/radio";
import type { RadioListPublicResponse } from "@/lib/api/types/radio.types";

const { date, toEmbedUrl } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch videos data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<RadioListPublicResponse>,
  RadioListPublicResponse
>(() => getRadioPublic({ page: currentPage.value }), {
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

// Video Modal
const videoModalRef = ref<InstanceType<typeof VideoModal> | null>(null);

const openVideoModal = (embedUrl: string) => {
  videoModalRef.value?.open(embedUrl);
};

// Watchers
watch(currentPage, () => {
  fetchData();

  window.scrollTo({ top: 0, behavior: "smooth" });
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
            <!-- Radio Grid -->
            <div class="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="radio in data.data"
                :key="radio.id"
                class="overflow-hidden rounded bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <!-- Radio Embed/Thumbnail -->
                <div class="relative aspect-video bg-gray-100">
                  <iframe
                    class="h-full w-full"
                    :src="toEmbedUrl(radio.link)"
                    frameborder="0"
                    allowfullscreen
                    loading="lazy"
                  ></iframe>
                </div>

                <!-- Radio Info -->
                <div class="p-4">
                  <!-- Date -->
                  <div class="mb-3 flex items-center text-sm text-gray-500">
                    <Calendar class="mr-2 h-4 w-4" />
                    <span>{{ date(radio.createdAt) }}</span>
                  </div>

                  <!-- Title -->
                  <a
                    href="#"
                    class="hover:text-portal-green mb-3 block text-lg font-semibold text-gray-900 transition-colors duration-200"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      line-clamp: 2;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                    @click.prevent="openVideoModal(toEmbedUrl(radio.link))"
                  >
                    {{ radio.judul }}
                  </a>

                  <!-- Source -->
                  <div class="mb-4 text-sm text-gray-600">
                    <span class="font-medium">Sumber:</span> {{ radio.isi ?? "Diskominfo" }}
                  </div>

                  <!-- Play Button -->
                  <button
                    @click="openVideoModal(toEmbedUrl(radio.link))"
                    class="bg-portal-green hover:bg-portal-green/90 flex w-full cursor-pointer items-center justify-center rounded-md px-4 py-2 text-white transition-colors duration-200"
                  >
                    <Play class="mr-2 h-4 w-4" />
                    Putar Radio
                  </button>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center">
              <BasePagination
                :page="currentPage"
                :totalPages="totalPages"
                :itemsPerPage="itemsPerPage"
                :totalItems="totalItems"
                @previousPage="prevPage"
                @nextPage="nextPage"
                @page="onPage"
              />
            </div>
          </template>
          <template v-else>
            <div class="mx-auto max-w-2xl">
              <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
                <File class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Tidak Ada Radio</h4>
                <p class="text-yellow-700">Maaf, belum ada radio yang tersedia saat ini.</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>

    <VideoModal ref="videoModalRef" />
  </div>
</template>
