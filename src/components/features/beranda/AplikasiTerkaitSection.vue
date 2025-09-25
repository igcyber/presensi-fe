<script setup lang="ts">
// import { RouterLink } from "vue-router";
import VueCarousel from "@/components/features/media/VueCarousel.vue";

import { useFormatters } from "@/composables/useFormatters";
import type { AplikasiTerkaitItem } from "@/lib/api/types/beranda.types";

interface Props {
  aplikasiTerkait: AplikasiTerkaitItem[];
}

defineProps<Props>();

const { date } = useFormatters();
</script>

<template>
  <!-- Aplikasi Terkait Section -->
  <section class="bg-gray-50 py-16">
    <div class="container">
      <!-- Header -->
      <div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="flex items-center">
          <div class="bg-portal-green mr-3 flex h-10 w-10 items-center justify-center rounded-full text-white">
            <i class="bx bx-mobile text-lg"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">
            <span class="font-bold">Aplikasi</span> Terkait ({{ aplikasiTerkait.length }})
          </h2>
        </div>
        <!-- <RouterLink
          :to="{ name: 'app.aplikasi-terkait' }"
          class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
        >
          Lihat lebih banyak
          <i class="bx bx-chevron-right ml-2"></i>
        </RouterLink> -->
      </div>

      <template v-if="aplikasiTerkait.length">
        <!-- Aplikasi Terkait Carousel -->
        <VueCarousel
          :items="aplikasiTerkait"
          :items-per-view="4"
          :autoplay="false"
          :autoplay-delay="4000"
          :responsive="{
            0: { itemsPerView: 1 },
            640: { itemsPerView: 2 },
            1024: { itemsPerView: 3 },
            1280: { itemsPerView: 4 },
          }"
        >
          <template #default="{ item: aplikasi }">
            <div
              class="group h-full overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <!-- App Cover/Icon -->
              <div class="relative aspect-square overflow-hidden bg-gray-100">
                <template v-if="aplikasi.coverUrl">
                  <img
                    :src="aplikasi.coverUrl"
                    :alt="aplikasi.text"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </template>
                <template v-else>
                  <div class="flex h-full w-full items-center justify-center">
                    <i class="bx bx-mobile text-6xl text-gray-400"></i>
                  </div>
                </template>
                <!-- Overlay -->
                <div
                  class="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                ></div>
                <!-- Open Icon -->
                <div
                  class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <a
                    :href="aplikasi.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900"
                  >
                    <i class="bx bx-link-external text-xl"></i>
                  </a>
                </div>
              </div>

              <!-- App Info -->
              <div class="p-4">
                <h3
                  class="mb-2 font-semibold text-gray-900"
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  "
                >
                  {{ aplikasi.text }}
                </h3>
                <div class="flex items-center justify-between">
                  <a
                    :href="aplikasi.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200"
                  >
                    <i class="bx bx-link-external mr-1"></i>
                    Buka Aplikasi
                  </a>
                  <div class="text-xs text-gray-500">
                    <i class="bx bx-calendar mr-1"></i>
                    {{ date(aplikasi.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </VueCarousel>
      </template>
      <template v-else>
        <div class="rounded bg-white p-8 text-center shadow-md">
          <i class="bx bx-mobile mb-4 text-4xl text-gray-400"></i>
          <p class="text-gray-600">Belum ada aplikasi terkait tersedia</p>
        </div>
      </template>
    </div>
  </section>
</template>
