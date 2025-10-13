<script setup lang="ts">
import { ChevronRight, Play, Video } from "lucide-vue-next";
import { RouterLink } from "vue-router";

import { useFormatters } from "@/composables/useFormatters";
import type { VideoItem } from "@/lib/api/types/beranda.types";

interface Props {
  videos: VideoItem[];
}

interface Emits {
  (e: "open-video-modal", embedUrl: string): void;
}

defineProps<Props>();
defineEmits<Emits>();

const { youtubeInfo } = useFormatters();
</script>

<template>
  <!-- Video Section -->
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 uppercase">
        <span class="border-b-4 border-yellow-600 pb-1">Video</span>
      </h2>
      <RouterLink
        :to="{ name: 'media.video' }"
        class="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
      >
        Lihat Semua
        <ChevronRight class="ml-2 h-4 w-4" />
      </RouterLink>
    </div>

    <template v-if="videos.length">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="video in videos"
          :key="video.id"
          class="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <!-- Video Thumbnail with Full Overlay -->
          <div class="relative aspect-video overflow-hidden">
            <template v-if="youtubeInfo(video.link).id">
              <div class="relative cursor-pointer" @click="$emit('open-video-modal', youtubeInfo(video.link).embedUrl)">
                <img
                  :src="youtubeInfo(video.link).thumb"
                  alt="Video Thumbnail"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                <!-- Dark Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <!-- Play Button Overlay -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="bg-portal-red flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110"
                  >
                    <Play class="h-6 w-6" />
                  </div>
                </div>

                <!-- Video Title Overlay -->
                <div class="absolute right-0 bottom-0 left-0 p-4 text-white">
                  <h3 class="line-clamp-2 text-sm font-bold">
                    {{ video.judul || "Video" }}
                  </h3>
                </div>
              </div>
            </template>
            <template v-else>
              <video controls class="h-full w-full object-cover">
                <source :src="video.link" type="video/mp4" />
                <source :src="video.link" type="video/webm" />
                <source :src="video.link" type="video/ogg" />
                Browser Anda tidak mendukung tag video.
              </video>
            </template>
          </div>
        </article>
      </div>
    </template>
    <!-- Empty State -->
    <template v-else>
      <div class="rounded-lg bg-white p-8 text-center shadow-md">
        <Video class="mx-auto mb-4 h-10 w-10 text-gray-400" />
        <p class="text-gray-600">Belum ada video tersedia</p>
      </div>
    </template>
  </div>
</template>
