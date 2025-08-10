<template>
  <nav class="navbar active-navbar fixed-top container-nav navbar-expand-lg navbar-light navbar-kukar">
    <div class="block">
      <!-- Top Navigation Bar -->
      <div class="container-fluid navatas">
        <div class="container pdless">
          <div id="navatas-left" class="navatas-left">
            <div class="navatas-content">
              <a class="navatas-text"> <i class="bx bx-map green"></i> {{ contactInfo.alamat }} </a>
              <a class="navatas-text"> <i class="bx bx-phone-call green"></i> {{ contactInfo.telepon }} </a>
              <a class="navatas-text"> <i class="bx bx-envelope green"></i> {{ contactInfo.email }} </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Navigation -->
      <div class="container navbar-padding">
        <a class="nav-item nav-link nav-logo" href="/">
          <img src="/logo.png" alt="logo" height="45" class="d-inline-block align-top" />
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="bx bx-menu"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <div class="navbar-nav ml-auto">
            <!-- Beranda -->
            <router-link class="nav-item nav-link" :class="{ active: isActive('/beranda') }" to="/beranda"> BERANDA </router-link>

            <!-- Selayang Pandang Dropdown -->
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                :class="{ active: isActive('/selayang-pandang') }"
                href="#"
                id="navbarDropdown1"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                SELAYANG PANDANG
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown1">
                <router-link class="dropdown-item" :class="{ active: isActive('/selayang-pandang/sejarah') }" to="/selayang-pandang/sejarah">
                  Sejarah Kukar
                </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/selayang-pandang/kependudukan') }" to="/selayang-pandang/kependudukan">
                  Kependudukan
                </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/selayang-pandang/potensi-daerah') }" to="/selayang-pandang/potensi-daerah">
                  Potensi Daerah
                </router-link>
                <router-link
                  class="dropdown-item"
                  :class="{ active: isActive('/selayang-pandang/prestasi-dan-penghargaan') }"
                  to="/selayang-pandang/prestasi-dan-penghargaan"
                >
                  Prestasi dan Penghargaan
                </router-link>
              </div>
            </li>

            <!-- Media Dropdown -->
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                :class="{ active: isActive('/media') }"
                href="#"
                id="navbarDropdown2"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                MEDIA
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown2">
                <router-link class="dropdown-item" :class="{ active: isActive('/media/video') }" to="/media/video"> Video </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/media/dokumen') }" to="/media/dokumen"> Dokumen </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/media/infografis') }" to="/media/infografis"> Infografis </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/media/majalah') }" to="/media/majalah"> E-Magazine </router-link>
              </div>
            </li>

            <!-- Pemerintahan Dropdown -->
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                :class="{ active: isActive('/pemerintahan') }"
                href="#"
                id="navbarDropdown3"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                PEMERINTAHAN
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown3">
                <router-link class="dropdown-item" :class="{ active: isActive('/pemerintahan/tugas-dan-fungsi') }" to="/pemerintahan/tugas-dan-fungsi">
                  Tugas dan Fungsi
                </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/pemerintahan/struktur-organisasi') }" to="/pemerintahan/struktur-organisasi">
                  Struktur Organisasi
                </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/pemerintahan/visi-misi') }" to="/pemerintahan/visi-misi">
                  Visi Misi Kukar
                </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/pemerintahan/strategi') }" to="/pemerintahan/strategi">
                  Strategi Daerah
                </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/pemerintahan/program-strategis') }" to="/pemerintahan/program-strategis">
                  Program Strategis
                </router-link>
                <router-link class="dropdown-item" :class="{ active: isActive('/pemerintahan/bupati') }" to="/pemerintahan/bupati">
                  Bupati Kukar Sepanjang Masa
                </router-link>
                <router-link
                  class="dropdown-item"
                  :class="{ active: isActive('/pemerintahan/transparansi-keuangan') }"
                  to="/pemerintahan/transparansi-keuangan"
                >
                  Transparansi Keuangan
                </router-link>
              </div>
            </li>

            <!-- Berita -->
            <router-link class="nav-item nav-link" :class="{ active: isActive('/berita') }" to="/berita"> BERITA </router-link>

            <!-- PPID -->
            <a class="nav-item nav-link" href="https://ppid.kukarkab.go.id/" target="_blank"> PPID </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

// Import composable
import { useAppData } from "@/composables/useAppData";

// Get contact info from composable
const { contactInfo } = useAppData();

// Get router component
const route = useRoute();

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

// Scroll effect for top navigation
const handleScroll = () => {
  const navatasLeft = document.getElementById("navatas-left");
  if (navatasLeft) {
    if (window.scrollY > 0) {
      navatasLeft.classList.add("navatas-left--hide");
    } else {
      navatasLeft.classList.remove("navatas-left--hide");
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
