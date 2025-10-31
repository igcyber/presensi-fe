<script setup lang="ts">
import { Phone } from "lucide-vue-next";

import DynamicIcon from "@/components/ui/DynamicIcon.vue";

import type { EmergencyItem } from "@/lib/api/types/beranda.types";

interface Props {
  emergencies: EmergencyItem[];
}

defineProps<Props>();
</script>

<template>
  <!-- Emergency Hotline Section -->
  <section class="bg-portal-blue-dark hidden py-6 text-white lg:block lg:py-8">
    <div class="container">
      <div class="flex flex-col items-center gap-6 lg:grid lg:grid-cols-4 lg:items-center lg:gap-8">
        <!-- Hotline Header -->
        <div class="text-center lg:col-span-1 lg:text-left">
          <div class="flex items-center justify-center lg:justify-start">
            <div
              class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 sm:h-14 sm:w-14 lg:h-12 lg:w-12"
            >
              <Phone class="h-5 w-5 sm:h-6 sm:w-6 lg:h-5 lg:w-5" />
            </div>
            <div>
              <h2 class="text-sm leading-tight font-medium sm:text-base lg:text-sm xl:text-base">
                Kontak Emergency<br />Masyarakat KUKAR
              </h2>
            </div>
          </div>
        </div>

        <template v-if="emergencies.length">
          <!-- Emergency Contacts -->
          <div class="w-full lg:col-span-3">
            <div
              class="grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
            >
              <div
                v-for="(emergency, idx) in emergencies"
                :key="idx"
                class="flex w-full items-center rounded-lg px-4 py-3 sm:justify-start"
              >
                <div
                  class="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 sm:h-12 sm:w-12"
                >
                  <DynamicIcon :name="`bx-${emergency.icon}`" icon-class="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div class="flex-1 text-center sm:text-left">
                  <p class="text-sm font-semibold sm:text-base lg:text-sm xl:text-base">{{ emergency.nama }}</p>
                  <p class="text-xs text-red-100 sm:text-sm lg:text-xs xl:text-sm">{{ emergency.isi }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="w-full lg:col-span-3">
            <div class="rounded-lg bg-white/10 p-4 text-center">
              <p class="text-sm text-white/80 sm:text-base">Belum ada kontak emergency tersedia</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
