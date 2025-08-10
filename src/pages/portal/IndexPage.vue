<script setup lang="ts">
import { RouterLink } from "vue-router";

import { usePortal } from "@/composables/usePortal";

// Menggunakan composable
const { menus, menuActive, openSubMenu, hasOpenSubMenu, toggleSubMenu, closeSubMenu } = usePortal();
</script>

<template>
  <!-- Main Portal container -->
  <div class="portal-container" :class="{ 'overflow-hidden': hasOpenSubMenu }">
    <div class="header-content">
      <img class="main-logo" src="/kukar-logo.png" alt="logo-kukarkab" />
      <div class="title-wrapper">
        <div class="intro-text">
          <p>Portal Resmi</p>
          <p>Kabupaten Kutai Kartanegara</p>
        </div>
        <p class="intro-sub-text">"Kukar Idaman Mitra Pembangunan IKN"</p>
      </div>

      <RouterLink class="button-web" to="/beranda">Website</RouterLink>
    </div>

    <!-- main content -->
    <div class="main-content">
      <div class="main-content-wrapper">
        <a
          v-for="menulist in menus"
          :key="menulist.id"
          class="menu-item-wrapper"
          :href="menulist.link"
          @click="menulist.link === '#' ? toggleSubMenu(menulist.id) : null"
          :target="menulist.link === '#' ? '_self' : '_blank'"
        >
          <img class="menu-logo" :src="menulist.icon" :alt="menulist.judul" />
          <p class="menu-title">{{ menulist.judul }}</p>
        </a>
      </div>
    </div>
    <!-- /main content -->

    <!-- submenu -->
    <div v-if="menuActive" class="popup-sub-menu" :style="{ display: openSubMenu ? 'block' : 'none' }">
      <div class="arrow" @click="closeSubMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16" fill="none">
          <path
            d="M8.77771 12.0378C8.37747 12.533 7.62253 12.533 7.22229 12.0378L3.25422 7.12862C2.72564 6.47468 3.19108 5.5 4.03193 5.5L11.9681 5.5C12.8089 5.5 13.2744 6.47468 12.7458 7.12862L8.77771 12.0378Z"
            fill="#89939E"
          />
        </svg>
      </div>
      <p class="sub-menu-title">{{ menuActive.judul }}</p>
      <div class="sub-menu-content">
        <!-- submenu dengan kategori 'null' -->
        <div v-if="menuActive.sub && menuActive.sub.length > 0" class="sub-menu-wrapper">
          <p class="sub-menu-list-header"></p>
          <ul class="sub-menu-list">
            <li v-for="submenu in menuActive.sub" :key="submenu.id">
              <a class="sub-menu-list-wrapper" :href="submenu.link" :target="submenu.link === '#' ? '_self' : '_blank'">
                <img v-if="submenu.icon" class="sub-menu-list-logo" :src="submenu.icon" :alt="submenu.judul" />
                <br v-if="submenu.icon" />
                {{ submenu.judul }}
              </a>
            </li>
          </ul>
        </div>

        <!-- by kategori -->
        <div v-for="kat in menuActive.kat" :key="kat.id" class="sub-menu-wrapper">
          <p class="sub-menu-list-header">{{ kat.judul }}</p>
          <ul class="sub-menu-list">
            <li v-for="submenu in kat.sub" :key="submenu.id" class="sub-menu-list-wrapper">
              <a class="sub-menu-list-wrapper" :href="submenu.link" :target="submenu.link === '#' ? '_self' : '_blank'">
                <img v-if="submenu.icon" class="sub-menu-list-logo" :src="submenu.icon" :alt="submenu.judul" />
                <span v-else>{{ submenu.judul }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- /submenu -->

    <!-- footer -->
    <div class="footer-content">
      <p>© 2024 Kabupaten Kutai Kartanegara All Rights Reserved - Developed by Diskominfo Kukar</p>
    </div>
    <!-- /footer -->
  </div>
  <!-- /Main Portal container -->

  <!-- bg-video -->
  <video autoplay muted loop class="bg-video">
    <source src="/portal-video.webm" type="video/webm" />
  </video>
  <!-- /bg-video -->
</template>

<style scoped>
/* ========================================= */
/* MAIN CONTAINER */
/* ========================================= */

.portal-container {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

/* ========================================= */
/* HEADER CONTENT */
/* ========================================= */

.header-content {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 20px auto 0 auto;
  width: 100%;
}

.title-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  text-align: center;
  width: fit-content;
}

.main-logo {
  height: 120px;
}

.intro-text {
  color: white;
  display: flex;
  flex-direction: column;
  font-size: 30px;
  font-weight: bold;
}

.intro-text p:first-child {
  line-height: 0.5;
}

.intro-sub-text {
  color: white;
}

.button-web {
  background-color: var(--color-primary);
  border-radius: 60px;
  color: white;
  display: inline-block;
  font-weight: 500;
  margin: 20px auto 40px auto;
  padding: 12px;
  text-align: center;
  text-decoration: none;
  transition: all 0.5s;
  width: 120px;
}

.button-web:hover {
  background-color: var(--color-primary-dark);
  box-shadow: 0px 4px 8px 0px rgba(171, 190, 209, 0.4);
}

/* ========================================= */
/* MAIN CONTENT */
/* ========================================= */

.main-content {
  height: fit-content;
  margin: auto 0 5% 0;
  width: 100%;
}

.main-content-wrapper {
  display: flex;
  flex-flow: row wrap;
  gap: 20px;
  justify-content: center;
  margin: 0 auto;
  width: 700px;
}

.menu-item-wrapper {
  background-color: var(--color-primary);
  border-radius: 10px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 90px;
  padding: 5px 0;
  text-decoration: none;
  transition: all 0.5s;
  width: 100px;
}

.menu-item-wrapper:hover {
  background-color: var(--color-primary-dark);
  box-shadow: 0px 4px 8px 0px rgba(171, 190, 209, 0.4);
}

.menu-logo {
  color: #fff;
  margin: auto auto;
  max-height: 100px;
  max-width: 40px;
  width: fit-content;
}

.menu-title {
  font-size: 13px;
  margin: 10px auto 5px auto;
  padding: 0 5px;
  text-align: center;
}

/* ========================================= */
/* SUBMENU */
/* ========================================= */

.popup-sub-menu {
  animation: slideUp 0.5s ease-in-out;
  background-color: var(--color-secondary);
  bottom: 0;
  display: none;
  height: 55%;
  max-height: 95%;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.arrow {
  border-bottom: 30px solid var(--color-secondary);
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  height: 0;
  margin: -30px auto auto auto;
  width: 0;
}

.arrow svg {
  animation: upDown 0.5s;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  margin: 10px 0 0 -20px;
  width: 40px;
}

.arrow svg:hover {
  cursor: pointer;
  transform: translateY(10px);
}

.sub-menu-title {
  font-size: 20px;
  margin: 20px 20px 10px 20px;
  padding: 10px;
  text-align: center;
}

.sub-menu-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 70%;
  margin: 0 0 30px 0;
  max-height: 90%;
  overflow-y: auto;
  padding: 0 10px 0px 70px;
}

.sub-menu-wrapper {
  flex-basis: 22%;
  flex-shrink: 0;
  height: fit-content;
  margin: 0 20px;
}

.sub-menu-list {
  list-style-type: circle;
  margin: 0 20px;
}

.sub-menu-list li {
  display: flex;
  margin-bottom: 7px;
  padding: 0;
  width: 330px;
}

.sub-menu-list-header {
  color: #e8ce53;
  font-size: 20px;
  margin: 30px 0 10px 0;
}

.sub-menu-list-wrapper {
  color: white;
  text-decoration: none;
}

.sub-menu-list-wrapper:hover {
  text-decoration: underline;
}

.sub-menu-list-logo {
  height: 40px;
  width: max-content;
}

.sub-menu-list-logo:hover {
  height: 45px;
}

/* ========================================= */
/* FOOTER */
/* ========================================= */

.footer-content {
  height: fit-content;
  width: 100%;
}

.footer-content p {
  color: white;
  margin: 20px;
  text-align: center;
}

/* ========================================= */
/* BACKGROUND ELEMENTS */
/* ========================================= */

.backround-bottom-wrapper {
  background-color: rgba(6, 32, 53);
  bottom: 0;
  display: flex;
  flex-direction: row;
  height: 70px;
  justify-content: center;
  position: absolute;
  width: 100%;
  z-index: -1;
}

.bg-image-wrapper {
  height: 200px;
  width: max-content;
}

.bg-bottom-image {
  height: 100px;
}

.bg-video {
  left: 0;
  min-height: 100%;
  min-width: 100%;
  position: fixed;
  top: 0;
}

/* ========================================= */
/* ANIMATIONS */
/* ========================================= */

@keyframes upDown {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(10px);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

/* ========================================= */
/* MEDIA QUERIES */
/* ========================================= */

/* Tablet & Large Mobile */
@media only screen and (max-width: 1000px) {
  .main-logo {
    height: 100px;
  }

  .sub-menu-content {
    display: block;
    padding: 0 30px;
  }

  .sub-menu-wrapper {
    width: fit-content;
  }
}

/* Mobile */
@media only screen and (max-width: 700px) {
  .main-logo {
    height: 90px;
  }

  .intro-text {
    font-size: 20px;
  }

  .main-content {
    margin: 0 0 auto 0;
  }

  .main-content-wrapper {
    justify-content: normal;
    width: 340px;
  }

  .menu-item-wrapper {
    width: 100px;
  }

  .menu-logo {
    width: 40px;
  }

  .footer-content p {
    font-size: small;
  }

  .popup-sub-menu {
    height: 90%;
  }

  .sub-menu-list-header {
    font-size: 18px;
  }

  .sub-menu-content {
    flex: block;
  }

  .sub-menu-wrapper {
    width: fit-content;
  }
}

/* Small Mobile */
@media only screen and (max-width: 450px) {
  .main-content {
    width: 100%;
  }

  .sub-menu-content {
    height: 85%;
    padding: 0;
  }
}

/* Extra Small Mobile */
@media screen and (max-width: 340px) {
  .main-content-wrapper {
    gap: 10px;
    width: 100%;
  }

  .menu-item-wrapper {
    width: 100%;
  }
}
</style>
