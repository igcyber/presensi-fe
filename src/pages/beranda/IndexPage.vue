<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  AplikasiTerkaitSection,
  ElectionInfoSection,
  EmergencySection,
  FeaturesSection,
  HeroSection,
  InfografisSection,
  NewsSection,
  OpdSection,
  ServicesSection,
  VideoSection,
} from "@/components/features/beranda";
import VideoModal from "@/components/modals/VideoModal.vue";

import { getBeranda } from "@/lib/api/services/beranda";
import {
  type AplikasiTerkaitItem,
  type BannerItem,
  type EmergencyItem,
  type LayananItem,
  type NewsItem,
  type OpdItem,
  type SistemItem,
  type VideoItem,
} from "@/lib/api/types/beranda.types";

const isLoading = ref<boolean>(false);

const emergencies = ref<EmergencyItem[]>([]);
const news = ref<NewsItem[]>([]);
const banners = ref<BannerItem[]>([]);
const videos = ref<VideoItem[]>([]);
const layanans = ref<LayananItem[]>([]);
const sistems = ref<SistemItem[]>([]);
const opds = ref<OpdItem[]>([]);
const aplikasiTerkait = ref<AplikasiTerkaitItem[]>([]);

// Video Modal (Bootstrap 4)
const videoModalRef = ref<InstanceType<typeof VideoModal> | null>(null);

const openVideoModal = (embedUrl: string) => {
  videoModalRef.value?.open(embedUrl);
};

// Fetch beranda
const fetchBeranda = async () => {
  try {
    isLoading.value = true;
    const response = await getBeranda();
    const responseData = response.data;

    emergencies.value = responseData.emergencies;
    news.value = responseData.berita;
    banners.value = responseData.banners;
    videos.value = responseData.videos;
    layanans.value = responseData.layanans;
    sistems.value = responseData.sistems;
    opds.value = responseData.opds;
    aplikasiTerkait.value = responseData.aplikasiTerkait;
  } catch (error) {
    console.error("Error fetching beranda:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchBeranda();
});
</script>

<template>
  <div class="min-h-screen">
    <!-- Navigation Spacer -->
    <div class="h-26.5 lg:h-40.5"></div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-[50vh] flex-col items-center justify-center">
      <div class="border-portal-green h-12 w-12 animate-spin rounded-full border-b-2"></div>
      <p class="mt-2 text-gray-600">Memuat data...</p>
    </div>

    <template v-else>
      <!-- Emergency Section -->
      <EmergencySection :emergencies="emergencies" />

      <!-- Hero Section -->
      <HeroSection />

      <!-- Features Section -->
      <FeaturesSection />

      <!-- News & Election Info Section -->
      <section class="bg-gray-50 py-16">
        <div class="container">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- News Section -->
            <NewsSection :news="news" />

            <!-- Election Info Section -->
            <ElectionInfoSection />
          </div>
        </div>
      </section>

      <!-- Infografis & Video Section -->
      <section class="bg-gray-100 py-16">
        <div class="container space-y-16">
          <!-- Infografis Section -->
          <InfografisSection :banners="banners" />

          <!-- Video Section -->
          <VideoSection :videos="videos" @open-video-modal="openVideoModal" />
        </div>
      </section>

      <!-- Services Section -->
      <ServicesSection :layanans="layanans" :sistems="sistems" />

      <!-- Aplikasi Terkait Section -->
      <AplikasiTerkaitSection :aplikasi-terkait="aplikasiTerkait" />

      <!-- OPD Section -->
      <OpdSection :opds="opds" />

      <VideoModal ref="videoModalRef" />
    </template>
  </div>
</template>

<style scoped></style>
