<template>
  <nav class="navbar active-navbar fixed-top container-nav navbar-expand-lg navbar-light navbar-kukar">
    <div class="block">
      <!-- Top Navigation Bar -->
      <div class="container-fluid navatas">
        <div class="pdless container">
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
      <div class="navbar-padding container">
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

        <div ref="collapseNavbar" class="navbar-collapse collapse" id="navbarNavDropdown">
          <div class="navbar-nav ml-auto">
            <template v-for="(item, idx) in navigation" :key="idx">
              <!-- Item tanpa anak -->
              <router-link
                v-if="!item.children && !item.external"
                class="nav-item nav-link"
                :class="{ active: isActivePath(route.path, item.path) }"
                :to="item.path"
              >
                {{ item.title }}
              </router-link>

              <!-- Item eksternal -->
              <a
                v-else-if="!item.children && item.external"
                class="nav-item nav-link"
                :href="item.path"
                target="_blank"
                rel="noopener"
              >
                {{ item.title }}
              </a>

              <!-- Item dengan submenu -->
              <li v-else class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  :class="{ active: isActivePath(route.path, item.path) }"
                  href="#"
                  :id="`navbarDropdown-${idx}`"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {{ item.title }}
                </a>
                <div class="dropdown-menu" :aria-labelledby="`navbarDropdown-${idx}`">
                  <router-link
                    v-for="(child, cIdx) in item.children"
                    :key="cIdx"
                    class="dropdown-item"
                    :class="{ active: isActivePath(route.path, child.path) }"
                    :to="child.path"
                  >
                    {{ child.title }}
                  </router-link>
                </div>
              </li>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

// Import composable
import { useAppData } from "@/composables/useAppData";
import { isActivePath } from "@/lib/utils/formatters";

// Get contact info from composable
const { contactInfo, navigation } = useAppData();

// Get router component
const route = useRoute();

const collapseNavbar = ref<HTMLElement | null>(null);

watch(
  () => route.path,
  (newPath) => {
    collapseNavbar.value?.classList.remove("show");
  },
);

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
