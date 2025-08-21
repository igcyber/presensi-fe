<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Spacer -->
    <div class="h-26.5 lg:h-40.5"></div>

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
            <i class="bx bx-error-circle mb-4 text-4xl text-red-500"></i>
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
          <template v-if="data.videos.length > 0">
            <!-- Video Grid -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="video in data.videos"
                :key="video.id"
                class="overflow-hidden rounded bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
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
                <div class="p-4">
                  <!-- Date -->
                  <div class="mb-3 flex items-center text-sm text-gray-500">
                    <i class="bx bx-calendar mr-2"></i>
                    <span>{{ formatters.date(video.createdAt) }}</span>
                  </div>

                  <!-- Title -->
                  <a
                    href="#"
                    class="hover:text-portal-green mb-3 block overflow-hidden text-lg font-semibold text-ellipsis text-gray-900 transition-colors duration-200"
                    style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical"
                    @click.prevent="openVideoModal(formatters.youtubeInfo(video.link).embedUrl)"
                  >
                    {{ video.judul }}
                  </a>

                  <!-- Source -->
                  <div class="mb-4 text-sm text-gray-600">
                    <span class="font-medium">Sumber:</span> {{ video.isi ?? "Diskominfo" }}
                  </div>

                  <!-- Watch Button -->
                  <button
                    @click="openVideoModal(formatters.youtubeInfo(video.link).embedUrl)"
                    class="bg-portal-green hover:bg-portal-green/90 flex w-full cursor-pointer items-center justify-center rounded-md px-4 py-2 text-white transition-colors duration-200"
                  >
                    <i class="bx bx-play mr-2"></i>
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

          <!-- Empty State for no documents -->
          <template v-else>
            <div class="mx-auto max-w-2xl">
              <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
                <i class="bx bx-file-blank mb-4 text-4xl text-yellow-600"></i>
                <h4 class="mb-4 text-xl font-semibold text-yellow-800">Tidak Ada Video</h4>
                <p class="text-yellow-700">Maaf, belum ada video yang tersedia saat ini.</p>
              </div>
            </div>
          </template>
        </div>

        <!-- Empty State -->
        <div v-else class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <i class="bx bx-info-circle mb-4 text-4xl text-yellow-600"></i>
            <h4 class="mb-4 text-xl font-semibold text-yellow-800">Data Tidak Ditemukan</h4>
            <p class="text-yellow-700">Maaf, data yang Anda cari tidak tersedia saat ini.</p>
          </div>
        </div>
      </div>
    </main>
  </div>

  <VideoModal ref="videoModalRef" />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import VideoModal from "@/components/VideoModal.vue";

import useFetch from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import { getVideos, type VideoListPayload, type VideoResponse } from "@/lib/api/media";

const formatters = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch videos data
const { data, isLoading, error, isError, fetchData } = useFetch<VideoResponse, VideoListPayload>(
  () => getVideos(currentPage.value),
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
