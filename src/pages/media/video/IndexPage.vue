<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div v-if="isLoading" class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else-if="isError" class="alert alert-danger">
          <h4>Error</h4>
          <p>{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
          <button class="btn btn-primary" @click="fetchData">Coba Lagi</button>
        </div>
        <template v-else-if="data">
          <div class="row">
            <div v-for="video in data.videos" :key="video.id" class="col-md-4">
              <div class="post">
                <div class="post-image-frame">
                  <iframe width="100%" height="100%" :src="video.link" :frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="post-date-frame">
                  <span class="post-date"><i class="bx bx-calendar"></i> {{ formatters.date(video.createdAt) }}</span>
                </div>

                <a href="#" class="post-link" @click="openVideoModal(formatters.youtubeInfo(video.link).embedUrl)">{{
                  video.judul
                }}</a>

                <div class="post-text">Sumber : {{ video.isi }}</div>
                <hr />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="col-md-12">
            <div class="alert alert-warning">Data kosong</div>
          </div>
        </template>
        <div class="col-md-12" v-if="!isLoading && !isError">
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
      </div>
    </div>
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
import { getVideos, type VideoData, type VideoDataPlayload, type VideoResponse } from "@/lib/api/media";

const formatters = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch videos data
const { data, isLoading, error, isError, fetchData } = useFetch<VideoResponse, VideoDataPlayload<VideoData>>(
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
