<script setup lang="ts">
import { ref } from "vue";

import VueCarousel from "@/components/features/media/VueCarousel.vue";
import VideoModal from "@/components/modals/VideoModal.vue";

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

// Video Modal (Bootstrap 4)
const videoModalRef = ref<InstanceType<typeof VideoModal> | null>(null);

const openVideoModal = (embedUrl: string) => {
  videoModalRef.value?.open(embedUrl);
};
</script>

<template>
  <!-- Video Section -->
  <div>
    <div class="mb-8 flex items-center">
      <div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
        <i class="bx bx-video text-lg"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-900">
        <span class="font-bold">Video</span>
      </h2>
    </div>

    <template v-if="videos.length">
      <VueCarousel
        :items="videos"
        :items-per-view="3"
        :autoplay="false"
        :autoplay-delay="4000"
        :responsive="{
          0: { itemsPerView: 1 },
          640: { itemsPerView: 2 },
          1024: { itemsPerView: 3 },
        }"
      >
        <template #default="{ item: video }">
          <div
            class="group overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <!-- Video Thumbnail -->
            <div class="relative aspect-video overflow-hidden">
              <template v-if="youtubeInfo(video.link).id">
                <div
                  class="relative cursor-pointer"
                  @click="$emit('open-video-modal', youtubeInfo(video.link).embedUrl)"
                >
                  <img
                    :src="youtubeInfo(video.link).thumb"
                    alt="Video Thumbnail"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <!-- Play Button Overlay -->
                  <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div
                      class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white transition-transform duration-300 hover:scale-110"
                    >
                      <i class="bx bx-play text-2xl"></i>
                    </div>
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

            <!-- Video Info -->
            <div class="p-4">
              <h3
                class="font-semibold text-gray-900"
                style="
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                "
              >
                {{ video.nama || "Video" }}
              </h3>
            </div>
          </div>
        </template>
      </VueCarousel>
    </template>
    <template v-else>
      <div class="rounded bg-white p-8 text-center shadow-md">
        <i class="bx bx-video mb-4 text-4xl text-gray-400"></i>
        <p class="text-gray-600">Belum ada video tersedia</p>
      </div>
    </template>

    <!-- Video Modal -->
    <VideoModal ref="videoModalRef" />
  </div>
</template>
