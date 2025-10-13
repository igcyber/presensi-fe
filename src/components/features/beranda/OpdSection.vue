<script setup lang="ts">
import { Building2, ChevronRight, Globe, Map } from "lucide-vue-next";
import { RouterLink } from "vue-router";

import VueCarousel from "@/components/features/media/VueCarousel.vue";

import { useFormatters } from "@/composables/useFormatters";
import type { OpdItem } from "@/lib/api/types/beranda.types";

interface Props {
  opds: OpdItem[];
}

defineProps<Props>();

const { slugify } = useFormatters();
</script>

<template>
  <!-- OPD Section -->
  <section class="bg-white py-16">
    <div class="container">
      <!-- Header -->
      <div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="flex items-center">
          <div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600 text-white">
            <Building2 class="h-5 w-5" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900">
            <span class="font-normal">Daftar OPD</span> ({{ opds.length }})
          </h2>
        </div>
        <RouterLink
          :to="{ name: 'unit-kerja.opd' }"
          class="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
        >
          Lihat lebih banyak
          <ChevronRight class="ml-2 h-4 w-4" />
        </RouterLink>
      </div>

      <template v-if="opds.length">
        <!-- OPD Carousel -->
        <VueCarousel
          :items="opds"
          :items-per-view="3"
          :autoplay="false"
          :autoplay-delay="5000"
          :responsive="{
            0: { itemsPerView: 1 },
            640: { itemsPerView: 2 },
            1024: { itemsPerView: 3 },
          }"
        >
          <template #default="{ item: opd }">
            <div
              class="group h-100 min-h-90 rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <!-- OPD Logo -->
              <div class="flex justify-center p-6 pb-4">
                <div class="flex h-40 w-full items-center justify-center overflow-hidden rounded">
                  <img
                    :src="opd.fotoUrl"
                    :alt="`Logo ${opd.nama}`"
                    class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              <!-- OPD Content -->
              <div class="px-6 pb-6">
                <!-- OPD Name -->
                <RouterLink
                  :to="{
                    name: 'unit-kerja.opd.detail',
                    params: { id: opd.id, slug: slugify(opd.nama) },
                  }"
                  class="mb-3 block text-center font-semibold text-gray-900 transition-colors duration-200 hover:text-yellow-600"
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  "
                >
                  {{ opd.nama }}
                </RouterLink>

                <!-- OPD Details -->
                <div class="space-y-2 text-sm text-gray-600">
                  <!-- Website -->
                  <div class="flex items-start">
                    <Globe class="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-yellow-600" />
                    <span class="break-all">{{ opd.website || "Website tidak tersedia" }}</span>
                  </div>
                  <!-- Address -->
                  <div class="flex items-start">
                    <Map class="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-yellow-600" />
                    <span class="break-words">{{ opd.alamat || "Alamat tidak tersedia" }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </VueCarousel>
      </template>
      <template v-else>
        <div class="rounded bg-white p-8 text-center shadow-md">
          <Building2 class="mx-auto mb-4 h-10 w-10 text-gray-400" />
          <p class="text-gray-600">Belum ada OPD tersedia</p>
        </div>
      </template>
    </div>
  </section>
</template>
