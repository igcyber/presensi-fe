<script setup lang="ts">
import { ChevronRight, Mail, Map, Phone, Printer } from "lucide-vue-next";
import { computed } from "vue";

// Import composable
import { useAppData } from "@/composables/useAppData";

// Get data from composable
const { footerInfo, relatedLinks, profileLinks } = useAppData();

// Computed properties
const currentYear = computed(() => new Date().getFullYear());

const hasFooterInfo = computed(() => {
  return !!(footerInfo.value.email || footerInfo.value.alamat || footerInfo.value.telepon || footerInfo.value.fax);
});

const hasProfileLinks = computed(() => profileLinks.value && profileLinks.value.length > 0);
const hasRelatedLinks = computed(() => relatedLinks.value && relatedLinks.value.length > 0);
</script>

<template>
  <footer class="bg-portal-blue-dark text-white">
    <div class="container py-8 sm:py-12 lg:py-16">
      <div class="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <!-- Logo Section -->
        <div class="flex flex-col items-center md:items-start lg:col-span-1">
          <div class="space-y-4 sm:space-y-5">
            <img
              class="h-10 w-auto sm:h-12 lg:h-14"
              src="/assets/images/logos/logo-dprd-white.png"
              alt="Logo DPRD Kutai Kartanegara"
              loading="lazy"
            />
            <img
              class="w-full max-w-[140px] sm:max-w-[160px]"
              src="/assets/images/logos/logo-pse.png"
              alt="Logo PSE Kominfo"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Contact Information -->
        <div v-if="hasFooterInfo" class="lg:col-span-1">
          <h3 class="mb-4 text-lg font-bold text-white sm:mb-6 sm:text-xl">Terhubung</h3>

          <div class="space-y-3 sm:space-y-4">
            <a
              v-if="footerInfo.email"
              :href="`mailto:${footerInfo.email}`"
              class="group flex items-start gap-2.5 text-sm text-gray-300 transition-all duration-200 hover:text-yellow-300 sm:text-base"
              :title="`Email ke ${footerInfo.email}`"
            >
              <Mail
                class="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 transition-transform duration-200 group-hover:scale-110 sm:h-6 sm:w-6"
              />
              <div class="min-w-0 flex-1 text-left">
                <span class="block text-xs font-semibold text-white sm:text-sm">Email</span>
                <span class="block break-all">{{ footerInfo.email }}</span>
              </div>
            </a>

            <div v-if="footerInfo.alamat" class="flex items-start gap-2.5 text-sm text-gray-300 sm:text-base">
              <Map class="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 sm:h-6 sm:w-6" />
              <div class="min-w-0 flex-1 text-left">
                <span class="block text-xs font-semibold text-white sm:text-sm">Alamat</span>
                <span class="block break-words">{{ footerInfo.alamat }}</span>
              </div>
            </div>

            <a
              v-if="footerInfo.telepon"
              :href="`tel:${footerInfo.telepon}`"
              class="group flex items-start gap-2.5 text-sm text-gray-300 transition-all duration-200 hover:text-yellow-300 sm:text-base"
              :title="`Hubungi ${footerInfo.telepon}`"
            >
              <Phone
                class="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 transition-transform duration-200 group-hover:scale-110 sm:h-6 sm:w-6"
              />
              <div class="min-w-0 flex-1 text-left">
                <span class="block text-xs font-semibold text-white sm:text-sm">Telepon</span>
                <span class="block whitespace-nowrap">{{ footerInfo.telepon }}</span>
              </div>
            </a>

            <div v-if="footerInfo.fax" class="flex items-start gap-2.5 text-sm text-gray-300 sm:text-base">
              <Printer class="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 sm:h-6 sm:w-6" />
              <div class="min-w-0 flex-1 text-left">
                <span class="block text-xs font-semibold text-white sm:text-sm">Fax</span>
                <span class="block whitespace-nowrap">{{ footerInfo.fax }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile -->
        <div v-if="hasProfileLinks" class="lg:col-span-1">
          <h3 class="mb-4 text-lg font-bold text-white sm:mb-6 sm:text-xl">Profil</h3>
          <nav class="space-y-2.5 sm:space-y-3" aria-label="Profil links">
            <a
              v-for="link in profileLinks"
              :key="link.id"
              :href="link.website"
              class="group flex items-center gap-2 text-sm text-gray-300 transition-all duration-200 hover:text-yellow-300 sm:text-base"
              target="_blank"
              rel="noopener noreferrer"
              :title="link.nama"
            >
              <ChevronRight
                class="h-4 w-4 flex-shrink-0 text-yellow-600 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
              />
              <span>{{ link.nama }}</span>
            </a>
          </nav>
        </div>

        <!-- Related Links -->
        <div v-if="hasRelatedLinks" class="lg:col-span-1">
          <h3 class="mb-4 text-lg font-bold text-white sm:mb-6 sm:text-xl">Link Terkait</h3>
          <nav class="space-y-2.5 sm:space-y-3" aria-label="Link terkait">
            <a
              v-for="link in relatedLinks"
              :key="link.id"
              :href="link.website"
              class="group flex items-center gap-2 text-sm text-gray-300 transition-all duration-200 hover:text-yellow-300 sm:text-base"
              target="_blank"
              rel="noopener noreferrer"
              :title="link.nama"
            >
              <ChevronRight
                class="h-4 w-4 flex-shrink-0 text-yellow-600 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
              />
              <span>{{ link.nama }}</span>
            </a>
          </nav>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="border-t border-white/10 bg-black/30 py-4 sm:py-6">
      <div class="container">
        <div
          class="flex flex-col items-center justify-center gap-2 text-center text-xs text-gray-400 sm:flex-row sm:text-sm"
        >
          <p class="flex flex-wrap items-center justify-center gap-1">
            <span>© {{ currentYear }} Dewan Perwakilan Rakyat Daerah Kabupaten Kutai Kartanegara.</span>
            <span class="hidden sm:inline">All Rights Reserved</span>
          </p>
          <span class="hidden text-gray-600 sm:inline">•</span>
          <p class="flex items-center gap-1">
            <span>Developed by</span>
            <a
              href="https://diskominfo.kukarkab.go.id/"
              class="font-medium text-gray-300 transition-colors duration-200 hover:text-yellow-300"
              target="_blank"
              rel="noopener noreferrer"
              title="Website Diskominfo Kukar"
            >
              Diskominfo Kukar
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
