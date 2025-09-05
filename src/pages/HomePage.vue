<script setup lang="ts">
import { ref } from "vue";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useFormatters } from "@/composables/useFormatters";

const { date } = useFormatters();

// Sample news data (in real app, this would come from API)
const latestNews = ref([
  {
    id: 1,
    title: "Pembangunan Infrastruktur Jalan di Kukar",
    excerpt: "Pemerintah Kabupaten Kutai Kartanegara terus berkomitmen dalam pembangunan infrastruktur...",
    image: "/images/news-1.jpg",
    date: new Date("2024-01-15"),
    slug: "pembangunan-infrastruktur-jalan-kukar",
  },
  {
    id: 2,
    title: "Program Pemberdayaan UMKM Kukar",
    excerpt: "Dinas Koperasi dan UMKM Kabupaten Kutai Kartanegara meluncurkan program baru...",
    image: "/images/news-2.jpg",
    date: new Date("2024-01-12"),
    slug: "program-pemberdayaan-umkm-kukar",
  },
  {
    id: 3,
    title: "Prestasi Tim Olahraga Kukar",
    excerpt: "Tim olahraga Kabupaten Kutai Kartanegara berhasil meraih prestasi gemilang...",
    image: "/images/news-3.jpg",
    date: new Date("2024-01-10"),
    slug: "prestasi-tim-olahraga-kukar",
  },
]);
</script>

<template>
  <div class="home-page">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="hero-title">Selamat Datang di Portal Kabupaten Kutai Kartanegara</h1>
            <p class="hero-subtitle">
              Portal resmi Pemerintah Kabupaten Kutai Kartanegara yang menyediakan informasi lengkap tentang selayang
              pandang, pemerintahan, media, dan berita terkini.
            </p>
            <div class="hero-buttons">
              <router-link to="/selayang-pandang/sejarah" class="btn btn-primary btn-lg">
                Selayang Pandang
              </router-link>
              <router-link to="/berita" class="btn btn-outline-primary btn-lg"> Berita Terkini </router-link>
            </div>
          </div>
          <div class="col-lg-6">
            <img src="/assets/images/logos/logo-kukar.png" alt="Logo Kukar" class="hero-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Links Section -->
    <section class="quick-links-section">
      <div class="container">
        <h2 class="section-title">Akses Cepat</h2>
        <div class="row">
          <div class="col-md-3 col-sm-6 mb-4">
            <div class="quick-link-card">
              <div class="card-icon">
                <i class="bx bx-news"></i>
              </div>
              <h3>Berita</h3>
              <p>Informasi terbaru seputar Kabupaten Kutai Kartanegara</p>
              <router-link to="/berita" class="btn btn-sm btn-outline-primary"> Lihat Berita </router-link>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-4">
            <div class="quick-link-card">
              <div class="card-icon">
                <i class="bx bx-video"></i>
              </div>
              <h3>Media</h3>
              <p>Video, dokumen, dan infografis terkait Kukar</p>
              <router-link to="/media/video" class="btn btn-sm btn-outline-primary"> Lihat Media </router-link>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-4">
            <div class="quick-link-card">
              <div class="card-icon">
                <i class="bx bx-building"></i>
              </div>
              <h3>Pemerintahan</h3>
              <p>Informasi struktur dan program pemerintah</p>
              <router-link to="/pemerintahan/struktur-organisasi" class="btn btn-sm btn-outline-primary">
                Lihat Struktur
              </router-link>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-4">
            <div class="quick-link-card">
              <div class="card-icon">
                <i class="bx bx-info-circle"></i>
              </div>
              <h3>PPID</h3>
              <p>Pejabat Pengelola Informasi dan Dokumentasi</p>
              <a href="https://ppid.kukarkab.go.id/" target="_blank" class="btn btn-sm btn-outline-primary">
                Kunjungi PPID
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest News Section -->
    <section class="latest-news-section">
      <div class="container">
        <h2 class="section-title">Berita Terkini</h2>
        <div class="row">
          <div v-for="news in latestNews" :key="news.id" class="col-lg-4 col-md-6 mb-4">
            <div class="news-card">
              <img :src="news.image" :alt="news.title" class="news-image" />
              <div class="news-content">
                <div class="news-date">{{ date(news.date) }}</div>
                <h3 class="news-title">{{ news.title }}</h3>
                <p class="news-excerpt">{{ news.excerpt }}</p>
                <router-link :to="`/berita/${news.slug}`" class="btn btn-sm btn-primary">
                  Baca Selengkapnya
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
