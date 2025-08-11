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
              <input class="intro-input" v-model="keyword" type="text" name="keyword" placeholder="Apa yang ingin anda cari?" />
              <input class="intro-btn btn-shadow" type="submit" value="Cari" />
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="row frame" style="padding-bottom: 80px">
      <div class="container" style="margin-bottom: 30px">
        <div class="row">
          <div class="col-md-4">
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
          <div class="col-md-4">
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
          <div class="col-md-4">
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
              <template v-if="berita1.length">
                <div v-for="beritas1 in berita1" :key="beritas1.id" class="col-md-6">
                  <div class="post">
                    <div class="post-image-frame">
                      <img :src="beritas1.foto" class="post-image" />
                    </div>
                    <a :href="`/berita/${beritas1.id}/${beritas1.judul.replace(/[\\s/]+/g, '-')}`" class="post-link mt-2">{{ beritas1.judul }}</a>
                    <div class="post-date-frame">
                      <span class="post-date"><i class="bx bx-calendar"></i> {{ formatters.date(beritas1.created_at) }}</span>
                    </div>
                    <div class="post-text">{{ beritas1.isi }}</div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="col-md-12">Data kosong</div>
              </template>

              <div v-if="beritaHasItems" class="col-md-12 mb-5 mb-md-0">
                <hr />
                <br />
                <a href="/berita?page=2" class="btn btn-success">Lihat lebih banyak <i class="bx bx-chevron-right"></i></a>
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

    <div class="row frame frame--grey" style="padding-bottom: 80px">
      <div class="container">
        <div class="container">
          <div class="headingtext">
            <span class="headingtext-icon"><i class="bx bx-image"></i> </span>
            <span class="headingtext-title"><b>Infografis</b></span>
          </div>
          <div :ref="setCarouselRef as VNodeRef" class="owl-carousel owl-theme baner slider">
            <div v-for="(bannerItem, idx) in banners" :key="idx" class="info">
              <div class="info-image-frame">
                <img :src="bannerItem.foto" class="info-image" />
                <div class="info-content">
                  <a :href="bannerItem.foto" target="_blank" class="doc-link">{{ bannerItem.nama }}</a>
                  <span class="info-date"><i class="bx bx-calendar"></i> {{ formatters.date(bannerItem.created_at) }}</span>
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
                  >
                    <img :src="youtubeInfo(video.link).thumb" alt="Video Thumbnail" class="slider-video" style="width: 100%; height: 100%; object-fit: cover" />
                    <div
                      style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 50%;
                        width: 60px;
                        height: 60px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
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

    <div class="row frame frame--bg">
      <div class="container">
        <div class="headingtext headingtext--white">
          <span class="headingtext-title b-20"
            ><b><i class="bx bx-check-circle"></i> Layanan</b> Publik ({{ layanans.length }})</span
          >
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div v-for="(layanan, lIdx) in layanans" :key="lIdx" class="col-sm-2">
            <div class="layanan layanan-light">
              <a :href="layanan.alamat" target="_blank">
                <div class="layanan-icon-frame">
                  <img :src="layanan.logo" class="layanan-icon" />
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
          <div v-for="(sistem, sIdx) in sistems" :key="sIdx" class="col-sm-2">
            <div class="layanan layanan-light">
              <a :href="sistem.alamat" target="_blank">
                <div class="layanan-icon-frame">
                  <img :src="sistem.logo" class="layanan-icon" />
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

    <div class="row frame frame--bgmap">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="headingtext">
              <a href="/unit-kerja/opd" class="headingtext-link">Lihat lebih banyak <i class="bx bx-chevron-right"></i></a>
              <span class="headingtext-title b-20"
                ><b><i class="bx bx-buildings"></i> Daftar OPD </b>Kutai Kartanegara ({{ opds.length }})</span
              >
            </div>
          </div>
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <div class="owl-carousel owl-theme opd-owl">
                  <div v-for="opd in opds" :key="opd.id" class="bupati bupati--opd">
                    <div class="bupati-image-frame">
                      <img class="bupati-image" :src="opd.foto" />
                    </div>
                    <div class="bupati-content-frame">
                      <a :href="`/unit-kerja/opd/${opd.id}/${opd.nama.replace(/[\\s/]+/g, '-')}`" class="bupati-name">{{ opd.nama }}</a>
                      <table>
                        <tr>
                          <td style="vertical-align: text-top"><i class="bx bx-globe bupati-icon"></i></td>
                          <td class="bupati-textgrey">{{ opd.website }}</td>
                        </tr>
                        <tr>
                          <td style="vertical-align: text-top"><i class="bx bx-map bupati-icon"></i></td>
                          <td class="bupati-textgrey">{{ opd.alamat }}</td>
                        </tr>
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
  </div>
</template>

<script setup lang="ts">
import type { VNodeRef } from "vue";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useFormatters } from "@/composables/useFormatters";

type EmergencyItem = { icon: string; nama: string; isi: string };
type BeritaItem = { id: number; judul: string; foto: string; created_at: Date; isi: string };
type BannerInfoItem = { foto: string; nama: string; created_at: Date };
type VideoItem = { link: string };
type LayananItem = { logo: string; alamat: string; nama: string };
type SistemItem = { logo: string; alamat: string; nama: string };
type OpdItem = { id: number; nama: string; foto: string; website: string; alamat: string };

const router = useRouter();
const formatters = useFormatters();

// Dummy Data (banner icon tidak digunakan untuk saat ini)

const emergencies = ref<EmergencyItem[]>([
  { icon: "clinic", nama: "RS.Parikesit", isi: "0541662387" },
  { icon: "shield", nama: "Polres Kukar", isi: "081214061874" },
  { icon: "water", nama: "Pemadam Kebakaran", isi: "085255637728" },
  { icon: "shield-alt", nama: "Satpol PP Kukar", isi: "081214061874" },
]);

const berita1 = ref<BeritaItem[]>([
  {
    id: 1,
    judul: "Pembangunan Infrastruktur Jalan di Kukar",
    foto: "/dummy.jpg",
    created_at: new Date("2024-01-15"),
    isi: "Pemerintah Kabupaten Kutai Kartanegara terus berkomitmen...",
  },
  {
    id: 2,
    judul: "Program Pemberdayaan UMKM Kukar",
    foto: "/dummy.jpg",
    created_at: new Date("2024-01-12"),
    isi: "Program baru untuk meningkatkan kapasitas UMKM...",
  },
  {
    id: 3,
    judul: "Prestasi Tim Olahraga Kukar",
    foto: "/dummy.jpg",
    created_at: new Date("2024-01-10"),
    isi: "Tim olahraga Kukar meraih prestasi gemilang...",
  },
  {
    id: 4,
    judul: "Peluncuran Program Digitalisasi Desa",
    foto: "/dummy.jpg",
    created_at: new Date("2024-01-08"),
    isi: "Meningkatkan akses teknologi di pedesaan...",
  },
]);

const banners = ref<BannerInfoItem[]>([
  { foto: "/banner-breadcrumb.png", nama: "Infografis 1", created_at: new Date("2024-01-05") },
  { foto: "/banner-breadcrumb.png", nama: "Infografis 2", created_at: new Date("2024-01-03") },
  { foto: "/banner-breadcrumb.png", nama: "Infografis 3", created_at: new Date("2024-01-03") },
  { foto: "/banner-breadcrumb.png", nama: "Infografis 4", created_at: new Date("2024-01-03") },
  { foto: "/banner-breadcrumb.png", nama: "Infografis 5", created_at: new Date("2024-01-03") },
]);

const videos = ref<VideoItem[]>([
  { link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { link: "/portal-video.webm" },
]);

const layanans = ref<LayananItem[]>([
  { logo: "/icon/ppid.png", alamat: "https://example.com/ppid", nama: "PPID" },
  { logo: "/icon/opd.png", alamat: "https://example.com/opd", nama: "OPD" },
  { logo: "/icon/layanan.png", alamat: "https://example.com/layanan", nama: "Layanan" },
  { logo: "/icon/pengaduan.png", alamat: "https://example.com/pengaduan", nama: "Pengaduan" },
]);

const sistems = ref<SistemItem[]>([
  { logo: "/icon/pengaduan.png", alamat: "https://example.com/sistem-a", nama: "Sistem A" },
  { logo: "/icon/opd.png", alamat: "https://example.com/sistem-b", nama: "Sistem B" },
  { logo: "/icon/layanan.png", alamat: "https://example.com/sistem-c", nama: "Sistem C" },
]);

const opds = ref<OpdItem[]>([
  { id: 1, nama: "Dinas A", foto: "/dummy.jpg", website: "https://dinas-a.kukar.go.id", alamat: "Jl. Mawar No. 1, Tenggarong" },
  { id: 2, nama: "Dinas B", foto: "/dummy.jpg", website: "https://dinas-b.kukar.go.id", alamat: "Jl. Melati No. 2, Tenggarong" },
  { id: 3, nama: "Dinas C", foto: "/dummy.jpg", website: "https://dinas-c.kukar.go.id", alamat: "Jl. Anggrek No. 3, Tenggarong" },
]);

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

const beritaHasItems = computed(() => berita1.value.length >= 1);

const carouselRef = ref<HTMLElement[]>([]);

const setCarouselRef = (el: HTMLElement | null) => {
  if (!el) return;
  carouselRef.value.push(el);
};

onMounted(async () => {
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
});
</script>

<style scoped></style>
