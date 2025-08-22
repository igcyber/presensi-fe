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
      <!-- Emergency Hotline Section -->
      <section class="bg-portal-blue-dark py-8 text-white">
        <div class="container">
          <div class="grid grid-cols-1 justify-center gap-8 lg:grid-cols-4">
            <!-- Hotline Header -->
            <div class="lg:col-span-1">
              <div class="flex items-center">
                <div class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <i class="bx bx-phone-call text-2xl"></i>
                </div>
                <div>
                  <h2 class="hidden text-base font-medium lg:block">Kontak Emergency<br />Masyarakat KUKAR</h2>
                  <h2 class="block text-lg font-bold lg:hidden">Kontak Emergency Masyarakat KUKAR</h2>
                </div>
              </div>
            </div>

            <!-- Emergency Contacts -->
            <div class="lg:col-span-3">
              <div class="grid grid-cols-1 justify-evenly gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div v-for="(emergency, idx) in emergencies" :key="idx" class="flex items-center">
                  <div class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <i :class="`bx bx-${emergency.icon}`" class="text-lg"></i>
                  </div>
                  <div>
                    <p class="font-semibold">{{ emergency.nama }}</p>
                    <p class="text-sm text-red-100">{{ emergency.isi }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hero Banner Section -->
      <section
        class="from-portal-green to-portal-green/90 relative bg-gradient-to-br bg-[url('/hero.png')] bg-cover bg-position-[bottom_right_-100px] bg-no-repeat py-30 text-white sm:bg-position-[bottom_right]"
      >
        <div class="container">
          <div class="mx-auto max-w-4xl text-center">
            <p class="mb-4 flex items-center justify-center text-lg">
              <i class="bx bx-home mr-2"></i>
              Selamat datang di portal resmi
            </p>
            <h1 class="mb-4 text-4xl font-bold md:text-5xl">Pemerintah Kabupaten<br />Kutai Kartanegara</h1>
            <p class="mb-8 text-xl text-green-100">"Kukar Idaman Mitra Pembangunan IKN"</p>

            <!-- Search Form -->
            <form @submit.prevent="submitSearch" class="mx-auto max-w-2xl">
              <div class="flex flex-col gap-3 sm:flex-row">
                <input
                  v-model="keyword"
                  type="text"
                  name="keyword"
                  placeholder="Apa yang ingin anda cari?"
                  class="flex-1 rounded-md border-0 bg-white px-6 py-4 text-gray-900 placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
                />
                <button
                  type="submit"
                  class="bg-portal-green hover:bg-portal-green/90 cursor-pointer rounded-md px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <i class="bx bx-search mr-2"></i>
                  Cari
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16">
        <div class="container">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1: Publikasi Statistik -->
            <div
              class="group flex items-center justify-start rounded bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:justify-center"
            >
              <div class="flex items-center">
                <div
                  class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white"
                >
                  <i class="bx bx-chart text-2xl"></i>
                </div>
                <div>
                  <a
                    href="https://kukarkab.bps.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-blue-600"
                  >
                    Publikasi Statistik
                  </a>
                  <p class="text-sm text-gray-500">www.kukarkab.bps.go.id</p>
                </div>
              </div>
            </div>

            <!-- Feature 2: Transparansi Keuangan -->
            <div
              class="group flex items-center justify-start rounded bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:justify-center"
            >
              <div class="flex items-center">
                <div
                  class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white"
                >
                  <i class="bx bx-wallet text-2xl"></i>
                </div>
                <div>
                  <RouterLink
                    to="/pemerintahan/transparansi-keuangan"
                    class="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-green-600"
                  >
                    Transparansi Keuangan
                  </RouterLink>
                  <p class="text-sm text-gray-500">www.kukarkab.go.id</p>
                </div>
              </div>
            </div>

            <!-- Feature 3: SPAN LAPOR -->
            <div
              class="group flex items-center justify-start rounded bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:justify-center"
            >
              <div class="flex items-center">
                <div
                  class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white"
                >
                  <i class="bx bx-chat text-2xl"></i>
                </div>
                <div>
                  <a
                    href="https://lapor.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-orange-600"
                  >
                    SPAN LAPOR!
                  </a>
                  <p class="text-sm text-gray-500">www.lapor.go.id</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- News & Election Info Section -->
      <section class="bg-gray-50 py-16">
        <div class="container">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- News Section -->
            <div class="lg:col-span-2">
              <div class="mb-8 flex items-center">
                <div class="bg-portal-green mr-3 flex h-10 w-10 items-center justify-center rounded-full text-white">
                  <i class="bx bx-news text-lg"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900"><span class="font-normal">Berita</span> Kabupaten</h2>
              </div>

              <template v-if="news.length">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <article
                    v-for="berita in news"
                    :key="berita.id"
                    class="group overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <!-- News Image -->
                    <div class="relative aspect-[16/10] overflow-hidden">
                      <img
                        :src="`https://kukarkab.go.id/uploads/beritas/${berita.foto}`"
                        :alt="berita.judul"
                        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <!-- News Content -->
                    <div class="p-4">
                      <!-- Date -->
                      <div class="mb-2 flex items-center text-sm text-gray-500">
                        <i class="bx bx-calendar mr-2"></i>
                        <time :datetime="new Date(berita.createdAt).toISOString()">{{
                          formatters.date(berita.createdAt)
                        }}</time>
                      </div>

                      <!-- Title -->
                      <a
                        :href="`/berita/${berita.id}/${berita.judul.replace(/[\\s/]+/g, '-')}`"
                        class="hover:text-portal-green mb-2 block text-lg font-semibold text-gray-900 transition-colors duration-200"
                        style="
                          display: -webkit-box;
                          -webkit-line-clamp: 2;
                          line-clamp: 2;
                          -webkit-box-orient: vertical;
                          overflow: hidden;
                        "
                      >
                        {{ berita.judul }}
                      </a>

                      <!-- Excerpt -->
                      <div
                        class="text-sm text-gray-600"
                        style="
                          display: -webkit-box;
                          -webkit-line-clamp: 3;
                          line-clamp: 3;
                          -webkit-box-orient: vertical;
                          overflow: hidden;
                        "
                        v-html="berita.isi.split(' ').slice(0, 17).join(' ') + '...'"
                      ></div>
                    </div>
                  </article>
                </div>

                <!-- View More Button -->
                <div v-if="news.length > 1" class="mt-8 text-center">
                  <RouterLink
                    :to="{ name: 'berita.index' }"
                    class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-md px-6 py-3 font-medium text-white transition-colors duration-200"
                  >
                    Lihat lebih banyak
                    <i class="bx bx-chevron-right ml-2"></i>
                  </RouterLink>
                </div>
              </template>

              <!-- Empty News State -->
              <template v-else>
                <div class="rounded bg-white p-8 text-center shadow-md">
                  <i class="bx bx-news mb-4 text-4xl text-gray-400"></i>
                  <p class="text-gray-600">Belum ada berita terbaru</p>
                </div>
              </template>
            </div>

            <!-- Election Info Sidebar -->
            <div class="lg:col-span-1">
              <div class="mb-6 flex items-center">
                <div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <i class="bx bx-news text-lg"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900"><span class="font-normal">Info</span> Pemilu</h3>
              </div>

              <!-- Election Widget Container -->
              <div class="rounded bg-white p-6 shadow-md">
                <div id="gpr-kominfo-widget-container"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Infografis & Video Section -->
      <section class="bg-gray-100 py-16">
        <div class="container space-y-16">
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
                      :src="`https://kukarkab.go.id/uploads/banners/${bannerItem.foto}`"
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
                        :href="`https://kukarkab.go.id/uploads/banners/${bannerItem.foto}`"
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
                      :href="`https://kukarkab.go.id/uploads/banners/${bannerItem.foto}`"
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
                      <time :datetime="new Date(bannerItem.createdAt).toISOString()">{{
                        formatters.date(bannerItem.createdAt)
                      }}</time>
                    </div>
                  </div>
                </div>
              </template>
            </VueCarousel>
          </div>

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
                    <template v-if="formatters.youtubeInfo(video.link).id">
                      <div
                        class="relative cursor-pointer"
                        @click="openVideoModal(formatters.youtubeInfo(video.link).embedUrl)"
                      >
                        <img
                          :src="formatters.youtubeInfo(video.link).thumb"
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
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section class="bg-portal-blue-dark py-16 text-white">
        <div class="container space-y-16">
          <!-- Layanan Publik -->
          <div>
            <div class="mb-8">
              <h2 class="text-2xl font-bold">
                <i class="bx bx-check-circle mr-3"></i>
                <span class="font-bold">Layanan</span> Publik ({{ layanans.length }})
              </h2>
            </div>

            <template v-if="layanans.length">
              <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <div v-for="(layanan, lIdx) in layanans" :key="lIdx" class="group flex justify-center">
                  <a
                    :href="layanan.alamat"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex h-20 w-20 items-center justify-center rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20"
                  >
                    <img
                      :src="`https://kukarkab.go.id/uploads/${layanan.logo}`"
                      :alt="layanan.nama || 'Layanan'"
                      class="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </a>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm">
                <i class="bx bx-info-circle mb-4 text-4xl text-white/60"></i>
                <p class="text-white/80">Belum ada layanan publik tersedia</p>
              </div>
            </template>
          </div>

          <!-- Sistem Administrasi -->
          <div>
            <div class="mb-8">
              <h2 class="text-2xl font-bold">
                <i class="bx bx-check-circle mr-3"></i>
                <span class="font-bold">Sistem</span> Administrasi ({{ sistems.length }})
              </h2>
            </div>

            <template v-if="sistems.length">
              <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <div v-for="(sistem, sIdx) in sistems" :key="sIdx" class="group flex justify-center">
                  <a
                    :href="sistem.alamat"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex h-20 w-20 items-center justify-center rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20"
                  >
                    <img
                      :src="`https://kukarkab.go.id/uploads/${sistem.logo}`"
                      :alt="sistem.nama || 'Sistem'"
                      class="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </a>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm">
                <i class="bx bx-info-circle mb-4 text-4xl text-white/60"></i>
                <p class="text-white/80">Belum ada sistem administrasi tersedia</p>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- OPD Section -->
      <section class="bg-white py-16">
        <div class="container">
          <!-- Header -->
          <div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div class="flex items-center">
              <div class="bg-portal-green mr-3 flex h-10 w-10 items-center justify-center rounded-full text-white">
                <i class="bx bx-buildings text-lg"></i>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">
                <span class="font-bold">Daftar OPD</span> Kutai Kartanegara ({{ opds.length }})
              </h2>
            </div>
            <RouterLink
              :to="{ name: 'unit-kerja.opd' }"
              class="bg-portal-green hover:bg-portal-green/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
            >
              Lihat lebih banyak
              <i class="bx bx-chevron-right ml-2"></i>
            </RouterLink>
          </div>

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
                class="group h-75 max-h-70 overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <!-- OPD Logo -->
                <div class="flex justify-center p-6 pb-4">
                  <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-50">
                    <img
                      :src="`https://kukarkab.go.id/uploads/${opd.foto}`"
                      :alt="`Logo ${opd.nama}`"
                      class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
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
                      params: { id: opd.id, slug: formatters.slugify(opd.nama) },
                    }"
                    class="hover:text-portal-green mb-3 block text-center font-semibold text-gray-900 transition-colors duration-200"
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
                      <i class="bx bx-globe text-portal-green mt-0.5 mr-2 flex-shrink-0"></i>
                      <span class="break-all">{{ opd.website || "Website tidak tersedia" }}</span>
                    </div>
                    <!-- Address -->
                    <div class="flex items-start">
                      <i class="bx bx-map text-portal-green mt-0.5 mr-2 flex-shrink-0"></i>
                      <span class="break-words">{{ opd.alamat || "Alamat tidak tersedia" }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </VueCarousel>
        </div>
      </section>

      <VideoModal ref="videoModalRef" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import VideoModal from "@/components/VideoModal.vue";
import VueCarousel from "@/components/VueCarousel.vue";

import { useFormatters } from "@/composables/useFormatters";
import {
  type BannerItem,
  type EmergencyItem,
  getBeranda,
  type LayananItem,
  type NewsItem,
  type OpdItem,
  type SistemItem,
  type VideoItem,
} from "@/lib/api/beranda";

const router = useRouter();
const formatters = useFormatters();

const isLoading = ref<boolean>(false);

const emergencies = ref<EmergencyItem[]>([]);

const news = ref<NewsItem[]>([]);

const banners = ref<BannerItem[]>([]);

const videos = ref<VideoItem[]>([]);

const layanans = ref<LayananItem[]>([]);

const sistems = ref<SistemItem[]>([]);

const opds = ref<OpdItem[]>([]);

// Form Pencarian
const keyword = ref<string>("");
function submitSearch() {
  const query = keyword.value ? { keyword: keyword.value } : {};
  router.push({ path: "/berita", query });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

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

<style scoped></style>
