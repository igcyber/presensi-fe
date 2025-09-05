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

const collapseMobileNavbar = ref<HTMLElement | null>(null);
const desktopNavRefs = ref<Map<number, HTMLElement>>(new Map());

// Mobile menu
const showMobileMenu = ref(false);
const activeSubmenu = ref<number | null>(null);
const mobileMenuButton = ref<HTMLElement | null>(null);
// Desktop menu
const activeDesktopMenu = ref<number | null>(null);
const showDesktopMenu = ref(false);

// Desktop menu functions
const toggleDesktopMenu = (idx: number) => {
  if (activeDesktopMenu.value === idx) {
    closeDesktopMenu();
  } else {
    showDesktopMenu.value = true;
    activeDesktopMenu.value = idx;
  }
};

const closeDesktopMenu = () => {
  showDesktopMenu.value = false;
  activeDesktopMenu.value = null;
};

// Ref management functions
const setDesktopNavRef = (el: Element | null, idx: number) => {
  if (el && el instanceof HTMLElement) {
    desktopNavRefs.value.set(idx, el);
  } else {
    desktopNavRefs.value.delete(idx);
  }
};

// Keyboard navigation functions
const handleDropdownKeydown = (event: KeyboardEvent, _idx: number) => {
  if (event.key === "Escape") {
    closeDesktopMenu();
  }
};

// Mobile menu functions
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  if (!showMobileMenu.value) {
    activeSubmenu.value = null;
  }
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
  activeSubmenu.value = null;
};

const toggleSubmenu = (idx: number) => {
  activeSubmenu.value = activeSubmenu.value === idx ? null : idx;
};

const onDocPointer = (e: PointerEvent) => {
  const target = e.target as Node;

  // Handle mobile menu click outside
  if (showMobileMenu.value) {
    if (!collapseMobileNavbar.value?.contains(target) && !mobileMenuButton.value?.contains(target)) {
      closeMobileMenu();
    }
    return;
  }

  // Handle desktop menu click outside
  if (showDesktopMenu.value && activeDesktopMenu.value !== null) {
    const activeNav = desktopNavRefs.value.get(activeDesktopMenu.value);

    if (activeNav && !activeNav.contains(target)) {
      closeDesktopMenu();
    }
  }
};

watch(
  () => route.path,
  () => {
    closeMobileMenu();
  },
);

watch(showMobileMenu, (newVal) => {
  if (newVal) {
    collapseMobileNavbar.value?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
});

onMounted(() => {
  document.addEventListener("pointerdown", onDocPointer);
});

onUnmounted(() => {
  document.removeEventListener("pointerdown", onDocPointer);

  // Clear refs
  desktopNavRefs.value.clear();
});
</script>

<template>
  <nav class="fixed top-0 right-0 left-0 z-50 bg-white shadow-lg">
    <!-- Top Navigation Bar -->
    <div id="navatasLeft" class="bg-portal-blue-dark hidden lg:block">
      <div class="container">
        <div class="transition-all duration-300">
          <div class="flex items-center gap-6 py-4 text-sm text-white">
            <a class="hover:text-portal-green flex items-center gap-2 transition-colors">
              <i class="bx bx-map text-portal-green"></i>
              {{ contactInfo.alamat }}
            </a>
            <a class="hover:text-portal-green flex items-center gap-2 transition-colors">
              <i class="bx bx-phone-call text-portal-green"></i>
              {{ contactInfo.telepon }}
            </a>
            <a class="hover:text-portal-green flex items-center gap-2 transition-colors">
              <i class="bx bx-envelope text-portal-green"></i>
              {{ contactInfo.email }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <div class="border-b border-gray-200 bg-gray-50 py-4">
      <div class="container">
        <div class="flex items-center justify-between py-3">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <img src="/assets/images/logos/logo-main.png" alt="logo" class="h-11" />
          </router-link>

          <!-- Mobile Menu Button -->
          <button
            ref="mobileMenuButton"
            class="flex cursor-pointer items-center rounded border border-gray-300 px-3 py-2 text-gray-600 hover:border-gray-500 hover:text-gray-900 lg:hidden"
            type="button"
            @click="toggleMobileMenu"
            aria-label="Toggle navigation"
          >
            <i class="bx bx-menu text-xl"></i>
          </button>

          <!-- Desktop Navigation -->
          <div class="hidden items-center space-x-1 lg:flex">
            <template v-for="(item, idx) in navigation" :key="idx">
              <!-- Item tanpa anak -->
              <router-link
                v-if="!item.children && !item.external"
                class="hover:text-portal-green relative px-3 py-4 text-sm font-medium text-gray-900 transition-colors"
                :class="{
                  'text-portal-green after:bg-portal-green font-bold after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5':
                    isActivePath(route.path, item.path),
                }"
                :to="item.path"
              >
                {{ item.title }}
              </router-link>

              <!-- Item eksternal -->
              <a
                v-else-if="!item.children && item.external"
                class="hover:text-portal-green px-3 py-4 text-sm font-medium text-gray-900 transition-colors"
                :href="item.path"
                target="_blank"
                rel="noopener"
              >
                {{ item.title }}
              </a>

              <!-- Item dengan submenu -->
              <div
                :ref="(el) => setDesktopNavRef(el as Element, idx)"
                v-else
                class="group relative"
                @keydown="handleDropdownKeydown($event, idx)"
              >
                <button
                  @click="toggleDesktopMenu(idx)"
                  class="hover:text-portal-green flex items-center gap-1 px-3 py-4 text-sm font-medium text-gray-900 transition-colors"
                  :class="{
                    'text-portal-green font-bold': isActivePath(route.path, item.path),
                  }"
                >
                  {{ item.title }}
                  <i
                    class="bx bx-chevron-down text-xs transition-transform duration-200"
                    :class="{ 'rotate-180': showDesktopMenu && activeDesktopMenu === idx }"
                  ></i>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-show="showDesktopMenu && activeDesktopMenu === idx"
                  class="absolute top-full left-0 z-50 mt-2 w-56 transform border border-gray-200 bg-white shadow-lg transition-all duration-200 ease-in-out"
                  :class="{
                    'visible translate-y-0 opacity-100': showDesktopMenu && activeDesktopMenu === idx,
                    'invisible -translate-y-2 opacity-0': !(showDesktopMenu && activeDesktopMenu === idx),
                  }"
                >
                  <div class="py-2">
                    <router-link
                      v-for="(child, cIdx) in item.children"
                      :key="cIdx"
                      class="hover:text-portal-green block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      :class="{
                        'text-portal-green bg-gray-50 font-medium': isActivePath(route.path, child.path),
                      }"
                      :to="child.path"
                      @click="closeDesktopMenu"
                    >
                      {{ child.title }}
                    </router-link>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div
          ref="collapseMobileNavbar"
          class="overflow-auto transition-all duration-300 ease-in-out lg:hidden"
          :class="{ 'max-h-0': !showMobileMenu, 'max-h-96 pb-4': showMobileMenu }"
        >
          <div class="space-y-1">
            <template v-for="(item, idx) in navigation" :key="idx">
              <!-- Item tanpa anak -->
              <router-link
                v-if="!item.children && !item.external"
                class="hover:text-portal-green block rounded px-3 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                :class="{ 'text-portal-green bg-gray-50 font-bold': isActivePath(route.path, item.path) }"
                :to="item.path"
                @click="closeMobileMenu"
              >
                {{ item.title }}
              </router-link>

              <!-- Item eksternal -->
              <a
                v-else-if="!item.children && item.external"
                class="hover:text-portal-green block rounded px-3 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                :href="item.path"
                target="_blank"
                rel="noopener"
              >
                {{ item.title }}
              </a>

              <!-- Item dengan submenu -->
              <div v-else class="space-y-1">
                <button
                  class="hover:text-portal-green flex w-full items-center justify-between rounded px-3 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                  :class="{ 'text-portal-green bg-gray-50': isActivePath(route.path, item.path) }"
                  @click="toggleSubmenu(idx)"
                >
                  {{ item.title }}
                  <i
                    class="bx bx-chevron-down text-xs transition-transform"
                    :class="{ 'rotate-180': activeSubmenu === idx }"
                  ></i>
                </button>

                <div
                  class="ml-4 space-y-1 overflow-hidden transition-all duration-300"
                  :class="{ 'max-h-0': activeSubmenu !== idx, 'max-h-96': activeSubmenu === idx }"
                >
                  <router-link
                    v-for="(child, cIdx) in item.children"
                    :key="cIdx"
                    class="hover:text-portal-green block rounded px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    :class="{ 'text-portal-green bg-gray-50 font-medium': isActivePath(route.path, child.path) }"
                    :to="child.path"
                    @click="closeMobileMenu"
                  >
                    {{ child.title }}
                  </router-link>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
