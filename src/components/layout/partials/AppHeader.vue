<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

// Import composable
import { useAppData } from "@/composables/useAppData";
import { isActivePath } from "@/lib/utils/formatters";

// Get contact info from composable
const { contactInfo, navigation } = useAppData();

// Get router component
const route = useRoute();

// Refs
const collapseMobileNavbar = ref<HTMLElement | null>(null);
const desktopNavRefs = ref<Map<number, HTMLElement>>(new Map());
const mobileMenuButton = ref<HTMLElement | null>(null);

// Mobile menu state
const showMobileMenu = ref(false);
const activeSubmenu = ref<number | null>(null);

// Desktop menu state
const activeDesktopMenu = ref<number | null>(null);
const showDesktopMenu = ref(false);

// Computed
const hasContactInfo = computed(() => {
  return !!(contactInfo.value.alamat || contactInfo.value.telepon || contactInfo.value.email);
});

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
    <!-- Top Navigation Bar - Contact Info -->
    <div v-if="hasContactInfo" class="bg-portal-blue-dark hidden lg:block">
      <div class="container">
        <div class="flex flex-wrap items-center gap-3 py-3 text-xs xl:gap-6 xl:py-4 xl:text-sm">
          <a
            v-if="contactInfo.alamat"
            class="hover:text-portal-green flex items-center gap-1.5 transition-colors xl:gap-2"
            :href="`https://maps.google.com/?q=${encodeURIComponent(contactInfo.alamat)}`"
            target="_blank"
            rel="noopener noreferrer"
            :title="contactInfo.alamat"
          >
            <i class="bx bx-map text-portal-green text-base xl:text-lg"></i>
            <span class="max-w-[200px] truncate text-white xl:max-w-none">{{ contactInfo.alamat }}</span>
          </a>
          <a
            v-if="contactInfo.telepon"
            class="hover:text-portal-green flex items-center gap-1.5 transition-colors xl:gap-2"
            :href="`tel:${contactInfo.telepon}`"
            :title="`Hubungi ${contactInfo.telepon}`"
          >
            <i class="bx bx-phone-call text-portal-green text-base xl:text-lg"></i>
            <span class="text-white">{{ contactInfo.telepon }}</span>
          </a>
          <a
            v-if="contactInfo.email"
            class="hover:text-portal-green flex items-center gap-1.5 transition-colors xl:gap-2"
            :href="`mailto:${contactInfo.email}`"
            :title="`Email ke ${contactInfo.email}`"
          >
            <i class="bx bx-envelope text-portal-green text-base xl:text-lg"></i>
            <span class="text-white">{{ contactInfo.email }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <div class="border-b border-gray-200 bg-gray-50">
      <div class="container">
        <div class="flex items-center justify-between py-2 sm:py-3">
          <!-- Logo -->
          <router-link to="/" class="flex items-center" :title="'Beranda'">
            <img
              src="/assets/images/logos/logo-dprd.png"
              alt="Logo"
              class="h-8 w-auto sm:h-10 lg:h-11 xl:h-14"
              loading="lazy"
            />
          </router-link>

          <!-- Mobile Menu Button -->
          <button
            ref="mobileMenuButton"
            class="hover:border-portal-green flex cursor-pointer items-center rounded border border-gray-300 px-2.5 py-2 text-gray-600 hover:text-gray-900 lg:hidden"
            type="button"
            @click="toggleMobileMenu"
            :aria-label="showMobileMenu ? 'Tutup menu' : 'Buka menu'"
            :aria-expanded="showMobileMenu"
          >
            <i
              class="bx text-xl transition-transform duration-300 ease-in-out"
              :class="showMobileMenu ? 'bx-x' : 'bx-menu'"
            ></i>
          </button>

          <!-- Desktop Navigation -->
          <nav class="hidden items-center gap-0.5 lg:flex xl:gap-1" aria-label="Menu navigasi utama">
            <template v-for="(item, idx) in navigation" :key="`nav-${idx}`">
              <!-- Item tanpa anak -->
              <router-link
                v-if="!item.children && !item.external"
                class="hover:text-portal-green hover:after:bg-portal-green relative rounded-sm px-2 py-3 text-center text-xs font-medium text-gray-900 transition-all duration-300 ease-in-out after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-transparent after:transition-all after:duration-300 xl:px-3 xl:py-4 xl:text-sm"
                :class="{
                  'text-portal-green after:bg-portal-green font-bold': isActivePath(route.path, item.path),
                }"
                :to="item.path"
                :title="item.title"
              >
                {{ item.title }}
              </router-link>

              <!-- Item eksternal -->
              <a
                v-else-if="!item.children && item.external"
                class="hover:text-portal-green hover:after:bg-portal-green relative rounded-sm px-2 py-3 text-xs font-medium text-gray-900 transition-all duration-300 ease-in-out after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-transparent after:transition-all after:duration-300 xl:px-3 xl:py-4 xl:text-sm"
                :href="item.path"
                target="_blank"
                rel="noopener noreferrer"
                :title="`${item.title} (buka di tab baru)`"
              >
                {{ item.title }}
                <i class="bx bx-link-external ml-0.5 text-xs"></i>
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
                  class="hover:text-portal-green hover:after:bg-portal-green relative flex items-center gap-0.5 rounded-sm px-2 py-3 text-xs font-medium text-gray-900 transition-all duration-300 ease-in-out after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-transparent after:transition-all after:duration-300 xl:gap-1 xl:px-3 xl:py-4 xl:text-sm"
                  :class="{
                    'text-portal-green after:bg-portal-green font-bold': isActivePath(route.path, item.path),
                  }"
                  :aria-expanded="showDesktopMenu && activeDesktopMenu === idx"
                  :aria-label="`${item.title} menu`"
                >
                  {{ item.title }}
                  <i
                    class="bx bx-chevron-down text-xs transition-transform duration-300 ease-in-out"
                    :class="{ 'rotate-180': showDesktopMenu && activeDesktopMenu === idx }"
                  ></i>
                </button>

                <!-- Dropdown Menu -->
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 scale-95 -translate-y-2"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-y-0"
                  leave-to-class="opacity-0 scale-95 -translate-y-2"
                >
                  <div
                    v-show="showDesktopMenu && activeDesktopMenu === idx"
                    class="absolute top-full left-0 z-50 mt-1 max-w-[280px] min-w-[220px] origin-top-left rounded-md border border-gray-200 bg-white shadow-xl"
                    role="menu"
                    :aria-label="`${item.title} submenu`"
                  >
                    <div class="py-1">
                      <router-link
                        v-for="(child, cIdx) in item.children"
                        :key="`submenu-${idx}-${cIdx}`"
                        class="hover:text-portal-green block px-4 py-2.5 text-xs text-gray-700 transition-all duration-200 ease-in-out hover:bg-gray-50 xl:text-sm"
                        :class="{
                          'text-portal-green bg-gray-50 font-medium': isActivePath(route.path, child.path),
                        }"
                        :to="child.path"
                        @click="closeDesktopMenu"
                        role="menuitem"
                        :title="child.title"
                      >
                        {{ child.title }}
                      </router-link>
                    </div>
                  </div>
                </Transition>
              </div>
            </template>
          </nav>
        </div>

        <!-- Mobile Navigation -->
        <Transition
          enter-active-class="transition-all duration-800 ease-out"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-[70vh] opacity-100"
          leave-active-class="transition-all duration-500 ease-in"
          leave-from-class="max-h-[70vh] opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <nav
            ref="collapseMobileNavbar"
            v-show="showMobileMenu"
            class="overflow-hidden lg:hidden"
            aria-label="Menu navigasi mobile"
          >
            <div class="space-y-0.5 py-2 pb-4">
              <template v-for="(item, idx) in navigation" :key="`mobile-nav-${idx}`">
                <!-- Item tanpa anak -->
                <router-link
                  v-if="!item.children && !item.external"
                  class="hover:text-portal-green block rounded-md px-3 py-2.5 text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-50 active:bg-gray-100"
                  :class="{ 'text-portal-green bg-gray-50 font-bold': isActivePath(route.path, item.path) }"
                  :to="item.path"
                  @click="closeMobileMenu"
                  :title="item.title"
                >
                  {{ item.title }}
                </router-link>

                <!-- Item eksternal -->
                <a
                  v-else-if="!item.children && item.external"
                  class="hover:text-portal-green flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-50"
                  :href="item.path"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="`${item.title} (buka di tab baru)`"
                >
                  <span>{{ item.title }}</span>
                  <i class="bx bx-link-external text-base"></i>
                </a>

                <!-- Item dengan submenu -->
                <div v-else class="space-y-0.5">
                  <button
                    class="hover:text-portal-green flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-50"
                    :class="{ 'text-portal-green bg-gray-50': isActivePath(route.path, item.path) }"
                    @click="toggleSubmenu(idx)"
                    :aria-expanded="activeSubmenu === idx"
                    :aria-label="`${item.title} menu`"
                  >
                    {{ item.title }}
                    <i
                      class="bx bx-chevron-down text-base transition-transform duration-300 ease-in-out"
                      :class="{ 'rotate-180': activeSubmenu === idx }"
                    ></i>
                  </button>

                  <Transition
                    enter-active-class="transition-all duration-400 ease-out"
                    enter-from-class="max-h-0 opacity-0 -translate-y-2"
                    enter-to-class="max-h-[500px] opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-300 ease-in"
                    leave-from-class="max-h-[500px] opacity-100 translate-y-0"
                    leave-to-class="max-h-0 opacity-0 -translate-y-2"
                  >
                    <div v-show="activeSubmenu === idx" class="ml-3 space-y-0.5 overflow-hidden">
                      <router-link
                        v-for="(child, cIdx) in item.children"
                        :key="`mobile-submenu-${idx}-${cIdx}`"
                        class="hover:text-portal-green hover:border-portal-green block rounded-md border-l-2 border-transparent px-4 py-2 text-sm text-gray-600 transition-all duration-200 ease-in-out hover:bg-gray-50"
                        :class="{
                          'text-portal-green border-portal-green bg-gray-50 font-medium': isActivePath(
                            route.path,
                            child.path,
                          ),
                        }"
                        :to="child.path"
                        @click="closeMobileMenu"
                        :title="child.title"
                      >
                        {{ child.title }}
                      </router-link>
                    </div>
                  </Transition>
                </div>
              </template>
            </div>
          </nav>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
