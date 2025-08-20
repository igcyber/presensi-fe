<template>
  <!-- Main Portal container -->
  <div
    class="absolute top-0 z-10 flex h-screen w-screen flex-col items-center overflow-auto bg-black/50"
    :class="{ 'overflow-hidden': hasOpenSubMenu }"
  >
    <!-- Header Content -->
    <header class="mt-5 mb-0 flex w-full flex-col items-center">
      <img class="h-[100px] md:h-[120px]" src="/kukar-logo.png" alt="logo-kukarkab" />

      <div class="mt-2.5 flex w-fit flex-col text-center">
        <div class="flex flex-col text-[30px] font-bold text-white">
          <p class="leading-5">Portal Resmi</p>
          <p>Kabupaten Kutai Kartanegara</p>
        </div>
        <p class="mt-2 text-white">"Kukar Idaman Mitra Pembangunan IKN"</p>
      </div>

      <RouterLink
        class="bg-portal-green hover:bg-portal-green-dark mt-5 inline-block w-[150px] rounded-[60px] p-3 text-center font-medium text-white transition-all duration-500 hover:shadow-[0_4px_8px_0_rgba(171,190,209,0.4)]"
        :to="{ name: 'beranda.index' }"
      >
        Website
      </RouterLink>
    </header>

    <!-- Main Content -->
    <main class="my-auto mb-20">
      <div class="flex flex-wrap justify-center gap-5">
        <a
          v-for="menulist in menus"
          :key="menulist.id"
          class="xs:w-full bg-portal-green hover:bg-portal-green-dark flex min-h-[90px] w-[100px] flex-col justify-between rounded-[10px] pt-2 pb-3 text-white transition-all duration-500 hover:shadow-[0_4px_8px_0_rgba(171,190,209,0.4)]"
          :href="menulist.link"
          @click="menulist.link === '#' ? toggleSubMenu(menulist.id) : null"
          :target="menulist.link === '#' ? '_self' : '_blank'"
        >
          <img
            class="mx-auto my-auto max-h-[100px] w-fit max-w-[40px] text-white"
            :src="`https://kukarkab.go.id/icon/portal-menu/${menulist.icon}`"
            :alt="menulist.judul"
          />
          <p class="mx-auto my-[10px_auto_5px_auto] px-[5px] text-center text-[13px]">{{ menulist.judul }}</p>
        </a>
      </div>

      <!-- Submenu -->
      <div
        v-if="menuActive"
        class="bg-portal-blue animate-slide-up absolute right-0 bottom-0 left-0 h-[55%] max-h-[95%] w-full"
        :style="{ display: openSubMenu ? 'block' : 'none' }"
      >
        <!-- Arrow -->
        <div
          class="border-b-portal-blue mx-auto -mt-[40px] h-0 w-0 border-r-[30px] border-b-[30px] border-l-[30px] border-r-transparent border-l-transparent"
          @click="closeSubMenu"
        >
          <svg
            class="animate-up-down mt-2.5 -ml-5 w-10 cursor-pointer hover:translate-y-2.5"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8.77771 12.0378C8.37747 12.533 7.62253 12.533 7.22229 12.0378L3.25422 7.12862C2.72564 6.47468 3.19108 5.5 4.03193 5.5L11.9681 5.5C12.8089 5.5 13.2744 6.47468 12.7458 7.12862L8.77771 12.0378Z"
              fill="#89939E"
            />
          </svg>
        </div>

        <!-- Submenu Title -->
        <h2 class="p-5 text-center text-xl text-white">{{ menuActive.judul }}</h2>

        <!-- Submenu Content -->
        <div class="flex max-h-[80%] flex-row flex-wrap justify-center gap-5 overflow-y-auto">
          <!-- Submenu dengan kategori 'null' -->
          <div v-if="menuActive.portalMenuSubs && menuActive.portalMenuSubs.length > 0" class="w-2/3 md:w-1/3 lg:w-1/4">
            <p class="text-xl text-[#e8ce53]"></p>
            <ul class="mx-5">
              <li v-for="submenu in menuActive.portalMenuSubs" :key="submenu.id" class="mb-1 flex">
                <a
                  class="text-white no-underline hover:underline"
                  :href="submenu.link"
                  :target="submenu.link === '#' ? '_self' : '_blank'"
                >
                  <img
                    v-if="submenu.icon"
                    class="h-10 w-max hover:h-[45px]"
                    :src="`https://kukarkab.go.id/uploads/${submenu.icon}`"
                    :alt="submenu.judul"
                  />
                  <br v-if="submenu.icon" />
                  {{ submenu.judul }}
                </a>
              </li>
            </ul>
          </div>

          <!-- By kategori -->
          <div v-for="kat in menuActive.portalMenuKats" :key="kat.id" class="w-2/3 md:w-1/3 lg:w-1/4">
            <p class="mb-2 text-xl text-[#e8ce53]">{{ kat.judul }}</p>
            <ul class="mx-5">
              <li v-for="submenu in kat.portalMenuSubs" :key="submenu.id" class="mb-1 flex">
                <a
                  class="text-white no-underline hover:underline"
                  :href="submenu.link"
                  :target="submenu.link === '#' ? '_self' : '_blank'"
                >
                  <img
                    v-if="submenu.icon"
                    class="h-10 w-max hover:h-[45px]"
                    :src="`https://kukarkab.go.id/uploads/${submenu.icon}`"
                    :alt="submenu.judul"
                  />
                  <span v-else>{{ submenu.judul }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="h-fit w-full">
      <p class="p-5 text-center text-white">
        © 2024 Kabupaten Kutai Kartanegara All Rights Reserved - Developed by Diskominfo Kukar
      </p>
    </footer>
  </div>

  <!-- Background Video -->
  <video autoplay muted loop class="fixed inset-0 h-full w-full object-cover">
    <source src="/portal-video.webm" type="video/webm" />
  </video>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router";

import { usePortal } from "@/composables/usePortal";

// Menggunakan composable
const { menus, menuActive, openSubMenu, hasOpenSubMenu, toggleSubMenu, closeSubMenu, fetchData } = usePortal();

onMounted(async () => {
  await fetchData();
});
</script>
