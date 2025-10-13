<script setup lang="ts">
import { ArrowRight, ChevronRight, Smartphone } from "lucide-vue-next";

// import { RouterLink } from "vue-router";
import type { AplikasiTerkaitItem } from "@/lib/api/types/beranda.types";

interface Props {
  aplikasiTerkait: AplikasiTerkaitItem[];
}

defineProps<Props>();

// Function untuk mendapatkan gradient color berdasarkan index
const getCardGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-600 to-blue-800",
    "bg-gradient-to-br from-purple-600 to-purple-800",
    "bg-gradient-to-br from-green-600 to-green-800",
    "bg-gradient-to-br from-red-600 to-red-800",
    "bg-gradient-to-br from-orange-600 to-orange-800",
    "bg-gradient-to-br from-indigo-600 to-indigo-800",
  ];
  return gradients[index % gradients.length];
};

const getBorderClasses = (index: number) => {
  return {
    "border-t-4 md:border-l-4": index == 0,
    "md:border-t-4 ": index == 1,
    "md:border-l-4 lg:border-t-4 lg:border-l-0": index == 2,
    "lg:border-l-4": index == 3,
    "md:border-l-4 md:border-b-4 lg:border-l-0": index == 4,
    "": index == 5,
  };
};
</script>

<template>
  <!-- Aplikasi Terkait Section -->
  <section class="bg-gray-50 py-16">
    <!-- Header -->
    <div class="container mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800 uppercase">
        <span class="hidden border-b-4 border-yellow-600 pb-1 md:block">Aplikasi Terkait</span>
        <span class="block border-b-4 border-yellow-600 pb-1 md:hidden">Aplikasi</span>
      </h2>
      <RouterLink
        :to="{ name: 'media.video' }"
        class="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-600/90"
      >
        Lihat Semua
        <ChevronRight class="ml-2 h-4 w-4" />
      </RouterLink>
    </div>

    <template v-if="aplikasiTerkait.length">
      <!-- Aplikasi Terkait Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(aplikasi, index) in aplikasiTerkait"
          :key="aplikasi.id"
          class="group relative min-h-[200px] overflow-hidden border-4 border-t-0 border-yellow-600 shadow-lg transition-all duration-300 md:border-l-0"
          :class="getBorderClasses(index)"
        >
          <!-- Background Image dengan Animasi Slide -->
          <div class="absolute inset-0 overflow-hidden">
            <template v-if="aplikasi.coverUrl">
              <div
                class="absolute inset-0 z-11 -translate-x-full transform bg-cover bg-center transition-transform duration-700 ease-out group-hover:translate-x-0"
                :style="{ backgroundImage: `url(${aplikasi.coverUrl})` }"
              ></div>
              <!-- Yellow overlay untuk serasi dengan border -->
              <div
                class="absolute inset-0 z-12 -translate-x-full transform bg-yellow-600/50 transition-transform duration-700 ease-out group-hover:translate-x-0"
              ></div>
            </template>
            <template v-else>
              <div
                class="absolute inset-0 -translate-x-full transform transition-transform duration-700 ease-out group-hover:translate-x-0"
                :class="getCardGradient(index)"
              ></div>
              <!-- Yellow overlay untuk serasi dengan border -->
              <div
                class="absolute inset-0 z-12 -translate-x-full transform bg-yellow-600/50 transition-transform duration-700 ease-out group-hover:translate-x-0"
              ></div>
            </template>
          </div>

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 z-10 bg-contain bg-bottom-left bg-no-repeat"
            style="background-image: url(/assets/images/backgrounds/bg-aplikasi.png); background-size: 100%"
          ></div>

          <!-- Content -->
          <div class="relative z-12 flex h-full flex-col p-4 sm:p-6">
            <!-- Icon di pojok kanan atas -->
            <div class="absolute top-3 right-3 sm:top-4 sm:right-4">
              <Smartphone class="h-6 w-6 text-gray-800 group-hover:text-white sm:h-8 sm:w-8" />
            </div>

            <!-- Title -->
            <h3 class="mb-2 line-clamp-2 text-xl font-bold text-gray-800 group-hover:text-white sm:text-xl lg:text-2xl">
              {{ aplikasi.text }}
            </h3>

            <!-- Description -->
            <p
              class="mb-3 line-clamp-3 flex-1 text-base text-gray-800/90 group-hover:text-white sm:mb-4 sm:text-sm lg:text-base"
            >
              Akses aplikasi {{ aplikasi.text }} untuk mendapatkan informasi dan layanan terbaik.
            </p>

            <!-- Button -->
            <a
              :href="aplikasi.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-base text-gray-800 transition-colors duration-200 group-hover:text-white hover:text-yellow-300 sm:text-sm lg:text-lg"
            >
              <span class="mr-2">Selengkapnya</span>
              <ArrowRight class="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </article>
      </div>
    </template>
    <!-- Empty State -->
    <template v-else>
      <div class="rounded-lg bg-white p-8 text-center shadow-md">
        <Smartphone class="mx-auto mb-4 h-10 w-10 text-gray-400" />
        <p class="text-gray-600">Belum ada aplikasi terkait tersedia</p>
      </div>
    </template>
  </section>
</template>
