<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";

import { useFormatters } from "@/composables/useFormatters";
import type { NewsItem } from "@/lib/api/types/beranda.types";

interface Props {
  news: NewsItem[];
}

const props = defineProps<Props>();

const { date, slugify, truncate } = useFormatters();

// Computed properties untuk memisahkan berita terbaru dan terpopuler
const beritaTerbaru = computed(() => props.news);
const beritaTerpopuler = computed(() => [...props.news].sort((a, b) => b.views - a.views).slice(0, 5));
</script>

<template>
  <!-- News Section -->
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Kolom Kiri: BERITA TERBARU -->
    <div class="lg:col-span-2">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 uppercase">
          <span class="border-b-4 border-yellow-600 pb-1">Berita Terbaru</span>
        </h2>
        <RouterLink
          :to="{ name: 'media.berita' }"
          class="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
        >
          Lihat Semua
          <i class="bx bx-chevron-right ml-2"></i>
        </RouterLink>
      </div>

      <template v-if="beritaTerbaru.length">
        <!-- Grid untuk semua berita -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <!-- 1 Berita Besar dengan Overlay (span 2 kolom) -->
          <article
            v-if="beritaTerbaru[0]"
            class="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2"
          >
            <!-- News Image Full -->
            <div class="relative aspect-[16/9] overflow-hidden">
              <img
                :src="beritaTerbaru[0].fotoUrl"
                :alt="beritaTerbaru[0].judul"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              <!-- Dark Overlay Gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              <!-- Content Overlay -->
              <div class="absolute right-0 bottom-0 left-0 p-6 text-white">
                <!-- Tag Kategori -->
                <div class="mb-3">
                  <span class="rounded bg-yellow-600 px-3 py-1 text-xs font-semibold text-white uppercase">
                    {{ beritaTerbaru[0].tag }}
                  </span>
                </div>

                <!-- Title -->
                <RouterLink
                  :to="{
                    name: 'media.berita.detail',
                    params: { id: beritaTerbaru[0].id, slug: slugify(beritaTerbaru[0].judul) },
                  }"
                  class="mb-3 block text-xl font-bold transition-colors duration-200 hover:text-yellow-600"
                >
                  {{ beritaTerbaru[0].judul }}
                </RouterLink>

                <!-- Meta Info -->
                <div class="flex items-center justify-between text-sm text-white/90">
                  <div class="flex items-center">
                    <i class="bx bx-show mr-2"></i>
                    <span>{{ beritaTerbaru[0].views }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="bx bx-calendar mr-2"></i>
                    <time
                      :datetime="beritaTerbaru[0].createdAt ? new Date(beritaTerbaru[0].createdAt).toISOString() : ''"
                    >
                      {{ beritaTerbaru[0].createdAt ? date(beritaTerbaru[0].createdAt) : "-" }}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- 3 Berita Kecil (masing-masing 1 kolom) -->
          <article
            v-for="berita in beritaTerbaru.slice(1)"
            :key="berita.id"
            class="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <!-- News Image -->
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                :src="berita.fotoUrl"
                :alt="berita.judul"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <!-- Tag Kategori -->
              <div class="absolute top-2 left-2">
                <span class="rounded bg-yellow-600 px-2 py-1 text-xs font-semibold text-white uppercase">
                  {{ berita.tag }}
                </span>
              </div>
            </div>

            <!-- News Content -->
            <div class="flex flex-1 flex-col justify-end p-4">
              <!-- Title -->
              <RouterLink
                :to="{
                  name: 'media.berita.detail',
                  params: { id: berita.id, slug: slugify(berita.judul) },
                }"
                class="mb-2 line-clamp-2 block text-sm font-bold text-gray-900 transition-colors duration-200 hover:text-yellow-600"
              >
                {{ berita.judul }}
              </RouterLink>

              <!-- Content Preview -->
              <div class="mb-3 line-clamp-3 text-xs text-gray-600" v-html="truncate(berita.isi, 150)"></div>

              <!-- Meta Info -->
              <div class="flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center">
                  <i class="bx bx-show mr-1"></i>
                  <span>{{ berita.views }}</span>
                </div>
                <div class="flex items-center">
                  <i class="bx bx-calendar mr-1"></i>
                  <time :datetime="berita.createdAt ? new Date(berita.createdAt).toISOString() : ''">
                    {{ berita.createdAt ? date(berita.createdAt) : "-" }}
                  </time>
                </div>
              </div>
            </div>
          </article>
        </div>
      </template>

      <!-- Empty News State -->
      <template v-else>
        <div class="rounded-lg bg-white p-8 text-center shadow-md">
          <i class="bx bx-news mb-4 text-4xl text-gray-400"></i>
          <p class="text-gray-600">Belum ada berita terbaru</p>
        </div>
      </template>
    </div>

    <!-- Kolom Kanan: TERPOPULER TERAKHIR -->
    <div class="lg:col-span-1">
      <h2 class="mb-6 text-xl font-bold text-gray-900 uppercase">
        <span class="border-b-4 border-yellow-600 pb-1">Terpopuler Terakhir</span>
      </h2>

      <template v-if="beritaTerpopuler.length">
        <div class="space-y-4">
          <article
            v-for="berita in beritaTerpopuler"
            :key="berita.id"
            class="group border-b border-gray-200 pb-4 last:border-b-0"
          >
            <RouterLink
              :to="{
                name: 'media.berita.detail',
                params: { id: berita.id, slug: slugify(berita.judul) },
              }"
              class="block"
            >
              <h3
                class="mb-2 line-clamp-2 text-sm font-bold text-gray-900 transition-colors duration-200 hover:text-yellow-600"
              >
                {{ berita.judul }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ berita.createdAt ? date(berita.createdAt) : "-" }}
              </p>
            </RouterLink>
          </article>
        </div>
      </template>

      <!-- Empty State -->
      <template v-else>
        <div class="rounded-lg bg-white p-6 text-center shadow-md">
          <i class="bx bx-trending-up mb-3 text-3xl text-gray-400"></i>
          <p class="text-sm text-gray-600">Belum ada data terpopuler</p>
        </div>
      </template>
    </div>
  </div>
</template>
