<script setup lang="ts">
import { CheckCircle, Info } from "lucide-vue-next";

import VueCarousel from "@/components/features/media/VueCarousel.vue";

import type { LayananItem, SistemItem } from "@/lib/api/types/beranda.types";

interface Props {
  layanans: LayananItem[];
  sistems: SistemItem[];
}

defineProps<Props>();
</script>

<template>
  <!-- Services Section -->
  <section class="bg-portal-blue-dark py-16 text-white">
    <div class="container space-y-16">
      <!-- Layanan Publik -->
      <div>
        <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div class="flex items-center">
            <div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <CheckCircle class="h-5 w-5" />
            </div>
            <h2 class="text-2xl font-bold"><span class="font-bold">Layanan</span> Publik ({{ layanans.length }})</h2>
          </div>
        </div>

        <template v-if="layanans.length">
          <VueCarousel
            :items="layanans"
            :items-per-view="6"
            :autoplay="false"
            :autoplay-delay="3000"
            :responsive="{
              0: { itemsPerView: 2 },
              640: { itemsPerView: 3 },
              1024: { itemsPerView: 4 },
              1280: { itemsPerView: 6 },
            }"
          >
            <template #default="{ item: layanan }">
              <div class="group flex justify-center">
                <a
                  :href="layanan.alamat"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex h-20 w-20 items-center justify-center rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20"
                >
                  <img
                    :src="layanan.logoUrl"
                    :alt="layanan.nama || 'Layanan'"
                    class="h-full w-full object-contain invert"
                    loading="lazy"
                  />
                </a>
              </div>
            </template>
          </VueCarousel>
        </template>
        <template v-else>
          <div class="rounded bg-white/10 p-8 text-center backdrop-blur-sm">
            <Info class="mx-auto mb-4 h-10 w-10 text-white/60" />
            <p class="text-white/80">Belum ada layanan publik tersedia</p>
          </div>
        </template>
      </div>

      <!-- Sistem Administrasi -->
      <div>
        <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div class="flex items-center">
            <div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <CheckCircle class="h-5 w-5" />
            </div>
            <h2 class="text-2xl font-bold">
              <span class="font-bold">Sistem</span> Administrasi ({{ sistems.length }})
            </h2>
          </div>
        </div>

        <template v-if="sistems.length">
          <VueCarousel
            :items="sistems"
            :items-per-view="6"
            :autoplay="false"
            :autoplay-delay="3000"
            :responsive="{
              0: { itemsPerView: 2 },
              640: { itemsPerView: 3 },
              1024: { itemsPerView: 4 },
              1280: { itemsPerView: 6 },
            }"
          >
            <template #default="{ item: sistem }">
              <div class="group flex justify-center">
                <a
                  :href="sistem.alamat"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex h-20 w-20 items-center justify-center rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20"
                >
                  <img
                    :src="sistem.logoUrl"
                    :alt="sistem.nama || 'Sistem'"
                    class="h-full w-full object-contain invert"
                    loading="lazy"
                  />
                </a>
              </div>
            </template>
          </VueCarousel>
        </template>
        <template v-else>
          <div class="rounded bg-white/10 p-8 text-center backdrop-blur-sm">
            <Info class="mx-auto mb-4 h-10 w-10 text-white/60" />
            <p class="text-white/80">Belum ada sistem administrasi tersedia</p>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
