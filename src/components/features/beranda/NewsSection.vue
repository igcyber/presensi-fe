<script setup lang="ts">
import { RouterLink } from "vue-router";

import VueCarousel from "@/components/features/media/VueCarousel.vue";

import { useFormatters } from "@/composables/useFormatters";
import type { NewsItem } from "@/lib/api/types/beranda.types";

interface Props {
  news: NewsItem[];
}

defineProps<Props>();

const { date, slugify } = useFormatters();
</script>

<template>
  <!-- News Section -->
  <div class="lg:col-span-3">
    <div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div class="flex items-center">
        <div class="bg-portal-green mr-3 flex h-10 w-10 items-center justify-center rounded-full text-white">
          <i class="bx bx-news text-lg"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900"><span class="font-normal">Berita</span> ({{ news.length }})</h2>
      </div>
      <RouterLink
        :to="{ name: 'berita.index' }"
        class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
      >
        Lihat lebih banyak
        <i class="bx bx-chevron-right ml-2"></i>
      </RouterLink>
    </div>

    <template v-if="news.length">
      <VueCarousel
        :items="news"
        :items-per-view="3"
        :autoplay="false"
        :autoplay-delay="5000"
        :responsive="{
          0: { itemsPerView: 1 },
          768: { itemsPerView: 2 },
          1024: { itemsPerView: 3 },
        }"
      >
        <template #default="{ item: berita }">
          <article
            class="group h-full overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <!-- News Image -->
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                :src="berita.fotoUrl"
                :alt="berita.judul"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <!-- News Content -->
            <div class="flex h-full min-h-[200px] flex-col p-4">
              <!-- Date -->
              <div class="mb-2 flex items-center text-sm text-gray-500">
                <i class="bx bx-calendar mr-2"></i>
                <time :datetime="berita.createdAt ? new Date(berita.createdAt).toISOString() : ''">{{
                  berita.createdAt ? date(berita.createdAt) : "-"
                }}</time>
              </div>

              <!-- Title -->
              <RouterLink
                :to="{
                  name: 'berita.detail',
                  params: { id: berita.id, slug: slugify(berita.judul) },
                }"
                class="hover:text-portal-green mb-2 block flex-shrink-0 text-lg font-semibold text-gray-900 transition-colors duration-200"
                style="
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  min-height: 3.5rem;
                "
              >
                {{ berita.judul }}
              </RouterLink>

              <!-- Excerpt -->
              <div
                class="flex-1 text-sm text-gray-600"
                style="
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  line-clamp: 3;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  min-height: 4.5rem;
                "
                v-html="berita.isi.split(' ').slice(0, 14).join(' ') + '...'"
              ></div>
            </div>
          </article>
        </template>
      </VueCarousel>
    </template>

    <!-- Empty News State -->
    <template v-else>
      <div class="rounded bg-white p-8 text-center shadow-md">
        <i class="bx bx-news mb-4 text-4xl text-gray-400"></i>
        <p class="text-gray-600">Belum ada berita terbaru</p>
      </div>
    </template>
  </div>
</template>
