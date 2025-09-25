<script setup lang="ts">
import VueCarousel from "@/components/features/media/VueCarousel.vue";

import { useFormatters } from "@/composables/useFormatters";
import type { BannerItem } from "@/lib/api/types/beranda.types";

interface Props {
  banners: BannerItem[];
}

defineProps<Props>();

const { date } = useFormatters();
</script>

<template>
  <!-- Infografis Section -->
  <div>
    <div class="mb-8 flex items-center">
      <div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
        <i class="bx bx-image text-lg"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-900">
        <span class="font-bold">Infografis</span>
      </h2>
    </div>

    <template v-if="banners.length">
      <VueCarousel
        :items="banners"
        :items-per-view="3"
        :autoplay="false"
        :autoplay-delay="3000"
        :responsive="{
          0: { itemsPerView: 1 },
          640: { itemsPerView: 2 },
          1024: { itemsPerView: 3 },
        }"
      >
        <template #default="{ item: bannerItem }">
          <div
            class="group overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <!-- Image -->
            <div class="relative aspect-[3/4] overflow-hidden">
              <img
                :src="bannerItem.fileUrl"
                :alt="bannerItem.nama"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <!-- Overlay -->
              <div
                class="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              ></div>
              <!-- Zoom Icon -->
              <div
                class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <a
                  :href="bannerItem.fileUrl"
                  data-lightbox="banner"
                  :data-title="bannerItem.nama"
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900"
                >
                  <i class="bx bx-zoom-in text-xl"></i>
                </a>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <a
                :href="bannerItem.fileUrl"
                data-lightbox="banner-title"
                :data-title="bannerItem.nama"
                class="hover:text-portal-green mb-2 block font-semibold text-gray-900 transition-colors duration-200"
                style="
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                "
              >
                {{ bannerItem.nama }}
              </a>
              <div class="flex items-center text-sm text-gray-500">
                <i class="bx bx-calendar mr-2"></i>
                <time :datetime="new Date(bannerItem.createdAt).toISOString()">{{ date(bannerItem.createdAt) }}</time>
              </div>
            </div>
          </div>
        </template>
      </VueCarousel>
    </template>
    <template v-else>
      <div class="rounded bg-white p-8 text-center shadow-md">
        <i class="bx bx-image mb-4 text-4xl text-gray-400"></i>
        <p class="text-gray-600">Belum ada infografis tersedia</p>
      </div>
    </template>
  </div>
</template>
