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
import { getVideoPublic } from "@/lib/api/services/video";
import type { VideoListPublicResponse } from "@/lib/api/types/video.types";

const { date, youtubeInfo } = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch videos data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<VideoListPublicResponse>,
  VideoListPublicResponse
>(() => getVideoPublic({ page: currentPage.value }), {
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
            <!-- Video Grid -->
            <div class="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="video in data.data"
                :key="video.id"
                class="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <!-- Video Thumbnail/Embed -->
                <div class="relative aspect-video bg-gray-100">
                  <iframe
                    class="h-full w-full"
                    :src="video.link"
                    frameborder="0"
                    allowfullscreen
                    loading="lazy"
                  ></iframe>
                </div>

                <!-- Video Info -->
                <div class="flex flex-1 flex-col p-4">
                  <!-- Date -->
                  <div class="mb-3 flex items-center text-sm text-gray-500">
                    <Calendar class="mr-2 h-4 w-4" />
                    <span>{{ date(video.createdAt) }}</span>
                  </div>

                  <!-- Title -->
                  <a
                    href="#"
                    class="mb-3 block overflow-hidden text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-yellow-600"
                    style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical"
                    @click.prevent="openVideoModal(youtubeInfo(video.link).embedUrl)"
                  >
                    {{ video.judul }}
                  </a>

                  <!-- Source -->
                  <div class="mb-4 flex-1 text-sm text-gray-600">
                    <span class="font-medium">Sumber:</span> {{ video.isi ?? "Video" }}
                  </div>

                  <!-- Watch Button -->
                  <button
                    @click="openVideoModal(youtubeInfo(video.link).embedUrl)"
                    class="mt-auto flex w-full items-center justify-center rounded-lg bg-yellow-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
                  >
                    <Play class="mr-2 h-4 w-4" />
                    Tonton Video
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
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Tidak Ada Video</h4>
                <p class="text-yellow-700">Maaf, belum ada video yang tersedia saat ini.</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>

  <VideoModal ref="videoModalRef" />
</template>
