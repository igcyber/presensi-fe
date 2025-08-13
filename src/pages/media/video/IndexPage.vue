<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />
  </div>

  <div class="row">
    <div class="container frame2">
      <div class="row">
        <template v-if="videos.length > 0">
          <div v-for="video in videos" :key="video.id" class="col-md-4">
            <div class="post">
              <div class="post-image-frame">
                <iframe width="100%" height="100%" :src="video.link" :frameborder="0" allowfullscreen></iframe>
              </div>
              <div class="post-date-frame">
                <span class="post-date"><i class="bx bx-calendar"></i> {{ formatters.date(video.created_at) }}</span>
              </div>
              <a href="#" class="post-link">{{ video.judul }}</a>
              <div class="post-text">Sumber : diskominfo</div>
              <hr />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="col-md-12">
            <div class="alert alert-warning">Data kosong</div>
          </div>
        </template>
        <div class="col-md-12">
          <BasePagination
            :page="currentPage"
            :totalPages="totalPages"
            :itemsPerPage="itemsPerPage"
            :totalItems="totalItems"
            @previousPage="prevPage"
            @nextPage="nextPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";

const formatters = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Data dummy untuk video
const videos = ref([
  {
    id: 1,
    judul: "Video Pembangunan Infrastruktur Kukar",
    link: "https://www.youtube.com/embed/2JDD50bZIHI",
    created_at: new Date("2024-01-15"),
  },
  {
    id: 2,
    judul: "Video Program UMKM Kukar",
    link: "https://www.youtube.com/embed/dnR6t99WJW0",
    created_at: new Date("2024-01-12"),
  },
  {
    id: 3,
    judul: "TUTORIAL PENDAFTARAN BEASISWA KUKAR IDAMAN",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    created_at: new Date("2024-01-10"),
  },
]);

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

onMounted(() => {
  setPagination({
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    itemsPerPage: 10,
  });
});
</script>
