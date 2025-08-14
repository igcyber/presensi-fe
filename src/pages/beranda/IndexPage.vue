<template>
  <div class="container-fluid navbreaker">
    <div class="row">
      <div class="hotline">
        <div class="container">
          <div class="hotline-left">
            <div class="hotline-heading">
              <div class="hotline-icon-frame">
                <span class="hotline-icon"><i class="bx bx-phone-call"></i></span>
              </div>
              <div class="hotline-content-frame">
                <p class="hotline-title hotline-title--big">Kontak Emergency<br />Masyarakat KUKAR.</p>
                <p class="hotline-title hotline-title--small">Kontak Emergency Masyarakat KUKAR.</p>
              </div>
            </div>
          </div>
          <div class="hotline-right">
            <div v-for="(emergency, idx) in emergencies" :key="idx" class="hotline-body">
              <div class="hotline-icon-frame">
                <span class="hotline-icon"><i :class="`bx bx-${emergency.icon}`"></i></span>
              </div>
              <div class="hotline-content-frame">
                <p class="hotline-title">{{ emergency.nama }}</p>
                <p class="hotline-text">{{ emergency.isi }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="banner">
        <div class="container">
          <div class="intro-search">
            <p class="intro-title"><i class="bx bx-home"></i> Selamat datang di portal resmi</p>
            <p class="intro-text">Pemerintah Kabupaten<br />Kutai Kartanegara</p>
            <p class="intro-subtext">"Kukar Idaman Mitra Pembangunan IKN"</p>
            <form class="intro-search-frame" @submit.prevent="submitSearch">
              <input
                class="intro-input"
                v-model="keyword"
                type="text"
                name="keyword"
                placeholder="Apa yang ingin anda cari?"
              />
              <input class="intro-btn btn-shadow" type="submit" value="Cari" />
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="row frame" style="padding-bottom: 60px">
      <div class="container" style="margin-bottom: 30px">
        <div class="row justify-content-center">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="fitur">
              <div class="fitur-iconframe">
                <div class="fitur-icon">
                  <i class="bx bx-chart"></i>
                </div>
              </div>
              <div class="fitur-contentframe">
                <a href="https://kukarkab.bps.go.id" target="_blank" class="fitur-title">Publikasi Statistik</a>
                <p class="fitur-link">www.kukarkab.bps.go.id</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="fitur">
              <div class="fitur-iconframe">
                <div class="fitur-icon">
                  <i class="bx bx-wallet"></i>
                </div>
              </div>
              <div class="fitur-contentframe">
                <a href="/pemerintahan/transparansi-keuangan" class="fitur-title">Transparansi Keuangan</a>
                <p class="fitur-link">www.kukarkab.go.id</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="fitur">
              <div class="fitur-iconframe">
                <div class="fitur-icon">
                  <i class="bx bx-chat"></i>
                </div>
              </div>
              <div class="fitur-contentframe">
                <a href="https://lapor.go.id" target="_blank" class="fitur-title">SPAN LAPOR!</a>
                <p class="fitur-link">www.lapor.go.id</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <div class="headingtext">
              <span class="headingtext-icon"><i class="bx bx-news"></i> </span>
              <span class="headingtext-title"><b>Berita</b> Kabupaten</span>
            </div>
            <div class="row">
              <template v-if="news.length">
                <div v-for="berita in news" :key="berita.id" class="col-md-6">
                  <div class="post">
                    <div class="post-image-frame">
                      <img :src="`https://kukarkab.go.id/uploads/beritas/${berita.foto}`" class="post-image" />
                    </div>
                    <a :href="`/berita/${berita.id}/${berita.judul.replace(/[\\s/]+/g, '-')}`" class="post-link mt-2">{{
                      berita.judul
                    }}</a>
                    <div class="post-date-frame">
                      <span class="post-date"
                        ><i class="bx bx-calendar"></i> {{ formatters.date(berita.createdAt) }}</span
                      >
                    </div>
                    <div class="post-text" v-html="berita.isi.split(' ').slice(0, 17).join(' ') + '...'"></div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="col-md-12">Data kosong</div>
              </template>

              <div v-if="news.length > 1" class="col-md-12 mb-md-0 mb-5">
                <hr />
                <br />
                <RouterLink :to="{ name: 'berita.index' }" class="btn btn-success"
                  >Lihat lebih banyak <i class="bx bx-chevron-right"></i
                ></RouterLink>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="headingtext">
              <span class="headingtext-icon"><i class="bx bx-news"></i> </span>
              <span class="headingtext-title"><b>Info</b> Pemilu</span>
            </div>
            <div class="row" style="margin-top: 20px">
              <div class="col-md-12">
                <div id="gpr-kominfo-widget-container"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row frame frame--grey" style="padding-bottom: 50px">
      <div class="container">
        <div class="container">
          <div class="headingtext">
            <span class="headingtext-icon"><i class="bx bx-image"></i> </span>
            <span class="headingtext-title"><b>Infografis</b></span>
          </div>
          <div :ref="setCarouselRef as VNodeRef" class="owl-carousel owl-theme baner slider">
            <div v-for="(bannerItem, idx) in banners" :key="idx" class="info">
              <div class="info-image-frame">
                <img :src="`https://kukarkab.go.id/uploads/banners/${bannerItem.foto}`" class="info-image" />
                <div class="info-content">
                  <a :href="bannerItem.foto" target="_blank" data-lightbox="banner" class="doc-link">{{
                    bannerItem.nama
                  }}</a>
                  <span class="info-date"
                    ><i class="bx bx-calendar"></i> {{ formatters.date(bannerItem.createdAt) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="headingtext">
            <span class="headingtext-icon"><i class="bx bx-video"></i> </span>
            <span class="headingtext-title"><b>Video</b></span>
          </div>
          <div :ref="setCarouselRef as VNodeRef" class="owl-carousel owl-theme baner slider">
            <div v-for="(video, vIdx) in videos" :key="vIdx" class="info">
              <div class="info-video-frame">
                <template v-if="youtubeInfo(video.link).id">
                  <div
                    class="info-video-frame"
                    :data-video-id="youtubeInfo(video.link).id"
                    :data-embed-url="youtubeInfo(video.link).embedUrl"
                    style="cursor: pointer; position: relative"
                    @click="openVideoModal(youtubeInfo(video.link).embedUrl)"
                  >
                    <img
                      :src="youtubeInfo(video.link).thumb"
                      alt="Video Thumbnail"
                      class="slider-video"
                      style="width: 100%; height: 100%; object-fit: cover"
                    />
                    <div class="slider-play">
                      <i class="bx bx-play-circle" style="font-size: 3rem; color: white"></i>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <video controls class="slider-video" style="width: 100%; height: 100%">
                    <source :src="video.link" type="video/mp4" />
                    <source :src="video.link" type="video/webm" />
                    <source :src="video.link" type="video/ogg" />
                    Browser Anda tidak mendukung tag video.
                  </video>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row frame frame--bg" style="padding-bottom: 50px">
      <div class="container">
        <div class="headingtext headingtext--white">
          <span class="headingtext-title b-20">
            <b><i class="bx bx-check-circle"></i> Layanan</b> Publik ({{ layanans.length }})
          </span>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div v-for="(layanan, lIdx) in layanans" :key="lIdx" class="col-6 col-md-2 d-flex justify-content-center">
            <div class="layanan layanan-light">
              <a :href="layanan.alamat" target="_blank">
                <div class="layanan-icon-frame">
                  <img :src="`https://kukarkab.go.id/uploads/${layanan.logo}`" class="layanan-icon" />
                </div>
              </a>
            </div>
          </div>
          <template v-if="!layanans.length">
            <div class="col-sm-12">Data kosong</div>
          </template>
        </div>
      </div>

      <div class="container">
        <br />
        <div class="headingtext headingtext--white">
          <span class="headingtext-title b-20"
            ><b><i class="bx bx-check-circle"></i> Sistem</b> Administrasi ({{ sistems.length }})</span
          >
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div v-for="(sistem, sIdx) in sistems" :key="sIdx" class="col-6 col-md-2 d-flex justify-content-center">
            <div class="layanan layanan-light">
              <a :href="sistem.alamat" target="_blank">
                <div class="layanan-icon-frame">
                  <img :src="`https://kukarkab.go.id/uploads/${sistem.logo}`" class="layanan-icon" />
                </div>
              </a>
            </div>
          </div>
          <template v-if="!sistems.length">
            <div class="col-sm-12">Data kosong</div>
          </template>
        </div>
      </div>
    </div>

    <div class="row frame frame--bgmap" style="padding-bottom: 70px">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="headingtext">
              <a href="/unit-kerja/opd" class="headingtext-link"
                >Lihat lebih banyak <i class="bx bx-chevron-right"></i
              ></a>
              <span class="headingtext-title b-20"
                ><b><i class="bx bx-buildings"></i> Daftar OPD </b>Kutai Kartanegara ({{ opds.length }})</span
              >
            </div>
          </div>
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <div :ref="setCarouselRef as VNodeRef" class="owl-carousel owl-theme opd-owl">
                  <div v-for="opd in opds" :key="opd.id" class="bupati bupati--opd">
                    <div class="bupati-image-frame">
                      <img class="bupati-image" :src="`https://kukarkab.go.id/uploads/${opd.foto}`" />
                    </div>
                    <div class="bupati-content-frame">
                      <a href="#" class="bupati-name">{{ opd.nama }}</a>
                      <table>
                        <tbody>
                          <tr>
                            <td style="vertical-align: text-top"><i class="bx bx-globe bupati-icon"></i></td>
                            <td class="bupati-textgrey">{{ opd.website }}</td>
                          </tr>
                          <tr>
                            <td style="vertical-align: text-top"><i class="bx bx-map bupati-icon"></i></td>
                            <td class="bupati-textgrey">{{ opd.alamat }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <div
      id="videoModal"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="videoModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="videoModalLabel">Video</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div id="videoContainer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VNodeRef } from "vue";
import { nextTick, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import { useFormatters } from "@/composables/useFormatters";
import { getBeranda } from "@/lib/api/beranda";

type EmergencyItem = { icon: string; nama: string; isi: string };
type newsItem = { id: number; judul: string; foto: string; createdAt: Date; isi: string };
type BannerInfoItem = { foto: string; nama: string; createdAt: Date };
type VideoItem = { id: number; judul: string; link: string; createdAt: Date; isi: string };
type LayananItem = { logo: string; alamat: string; nama: string };
type SistemItem = { logo: string; alamat: string; nama: string };
type OpdItem = { id: number; nama: string; foto: string; website: string; alamat: string };

const router = useRouter();
const formatters = useFormatters();

const emergencies = ref<EmergencyItem[]>([]);

const news = ref<newsItem[]>([]);

const banners = ref<BannerInfoItem[]>([]);

const videos = ref<VideoItem[]>([]);

const layanans = ref<LayananItem[]>([]);

const sistems = ref<SistemItem[]>([]);

const opds = ref<OpdItem[]>([]);

// Form Pencarian
const keyword = ref<string>("");
function submitSearch() {
  const query = keyword.value ? { keyword: keyword.value } : {};
  router.push({ path: "/berita", query });
}

function youtubeInfo(link: string) {
  const ytWatch = /youtube\.com\/watch\?v=([^&]+)/;
  const ytShort = /youtu\.be\/([^?]+)/;
  const ytEmbed = /youtube\.com\/embed\/([^?]+)/;
  let id = "";
  let embedUrl = "";
  let thumb = "";
  const m1 = link.match(ytWatch);
  const m2 = link.match(ytShort);
  const m3 = link.match(ytEmbed);
  if (m1?.[1]) id = m1[1];
  else if (m2?.[1]) id = m2[1];
  else if (m3?.[1]) id = m3[1];
  if (id) {
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }

  return { id, embedUrl, thumb };
}

const openVideoModal = (embedUrl: string) => {
  const modalElement = document.getElementById("videoModal") as HTMLDivElement;
  const videoContainer = document.getElementById("videoContainer") as HTMLDivElement;

  if (videoContainer && modalElement && (window as any).$) {
    // Clear previous content
    videoContainer.innerHTML = "";

    // Create iframe with responsive styling
    videoContainer.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 400px; aspect-ratio: 16/9;"></iframe>`;

    // Use jQuery to show modal (Bootstrap 4)
    const $modal = (window as any).$(modalElement);

    // Add event listener for modal close (only once)
    $modal.off("hidden.bs.modal.videoModal").on("hidden.bs.modal.videoModal", () => {
      // Stop video when modal is closed
      videoContainer.innerHTML = "";
    });

    $modal.modal("show");
  }
};

// Fetch beranda
const fetchBeranda = async () => {
  try {
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
    console.error(error);
  }
};

const carouselRef = ref<HTMLElement[]>([]);

const setCarouselRef = (el: HTMLElement | null) => {
  if (!el) return;
  carouselRef.value.push(el);
};

const initialCarousel = async () => {
  await nextTick();

  if (!(window as any).jQuery?.fn?.owlCarousel) {
    try {
      await import("owl.carousel");
    } catch (e) {
      await import("owl.carousel/dist/owl.carousel");
    }
  }

  carouselRef.value.forEach((el) => {
    const $el = (window as any).jQuery(el);
    $el.owlCarousel({
      items: 3,
      loop: true,
      margin: 16,
      nav: false,
      dots: true,
      autoplay: true,
      autoplayTimeout: 3000,
      responsive: { 0: { items: 1 }, 640: { items: 2 }, 1024: { items: 3 } },
    });
  });
};

onMounted(async () => {
  await fetchBeranda();

  await initialCarousel();
});
</script>

<style scoped></style>
