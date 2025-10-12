<script setup lang="ts">
import { RouterLink } from "vue-router";

import VueCarousel from "@/components/features/media/VueCarousel.vue";

import { useFormatters } from "@/composables/useFormatters";
import type { InfografisItem } from "@/lib/api/types/beranda.types";

interface Props {
  infografis: InfografisItem[];
}

defineProps<Props>();

const { date } = useFormatters();
</script>

<template>
  <!-- Infografis Section -->
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 uppercase">
        <span class="border-b-4 border-yellow-600 pb-1">Infografis</span>
      </h2>
      <RouterLink
        :to="{ name: 'media.infografis' }"
        class="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-600/90"
      >
        Lihat Semua
        <i class="bx bx-chevron-right ml-2"></i>
      </RouterLink>
    </div>

    <template v-if="infografis.length">
      <VueCarousel
        :items="infografis"
        :items-per-view="4"
        :autoplay="false"
        :autoplay-delay="3000"
        :responsive="{
          0: { itemsPerView: 1 },
          480: { itemsPerView: 2 },
          640: { itemsPerView: 3 },
          1024: { itemsPerView: 4 },
        }"
      >
        <template #default="{ item: infografisItem }">
          <article
            class="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <!-- Image -->
            <div class="relative aspect-[3/4] overflow-hidden">
              <img
                :src="infografisItem.fileUrl"
                :alt="infografisItem.nama"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />

              <!-- Dark Overlay Gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <!-- Zoom Icon Center -->
              <div
                class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <a
                  :href="infografisItem.fileUrl"
                  data-lightbox="infografis"
                  :data-title="infografisItem.nama"
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900 transition-transform duration-200 hover:scale-110"
                >
                  <i class="bx bx-zoom-in text-xl"></i>
                </a>
              </div>

              <!-- Title & Date Overlay Bottom -->
              <div class="absolute right-0 bottom-0 left-0 p-4">
                <h3 class="mb-1 line-clamp-2 text-sm font-bold text-white">
                  {{ infografisItem.nama }}
                </h3>
                <div class="flex items-center text-xs text-white/90">
                  <i class="bx bx-calendar mr-1"></i>
                  <time :datetime="new Date(infografisItem.createdAt || '').toISOString()">
                    {{ date(infografisItem.createdAt) }}
                  </time>
                </div>
              </div>
            </div>
          </article>
        </template>
      </VueCarousel>
    </template>
    <!-- Empty State -->
    <template v-else>
      <div class="rounded-lg bg-white p-8 text-center shadow-md">
        <i class="bx bx-image mb-4 text-4xl text-gray-400"></i>
        <p class="text-gray-600">Belum ada infografis tersedia</p>
      </div>
    </template>
  </div>
</template>
