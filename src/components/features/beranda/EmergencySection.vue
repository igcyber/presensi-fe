<script setup lang="ts">
import type { EmergencyItem } from "@/lib/api/types/beranda.types";

interface Props {
  emergencies: EmergencyItem[];
}

defineProps<Props>();
</script>

<template>
  <!-- Emergency Hotline Section -->
  <section class="bg-portal-blue-dark hidden py-8 text-white lg:block">
    <div class="container">
      <div class="grid grid-cols-1 items-center justify-center gap-8 lg:grid-cols-4">
        <!-- Hotline Header -->
        <div class="lg:col-span-1">
          <div class="flex items-center">
            <div
              class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 sm:mr-4 sm:h-16 sm:w-16"
            >
              <i class="bx bx-phone-call text-lg sm:text-xl"></i>
            </div>
            <div>
              <h2 class="text-sm font-medium sm:text-base md:hidden">Kontak Emergency<br />Masyarakat KUKAR</h2>
              <h2 class="hidden text-sm font-medium md:block lg:text-base xl:text-base">
                Kontak Emergency<br />Masyarakat KUKAR
              </h2>
            </div>
          </div>
        </div>

        <template v-if="emergencies.length">
          <!-- Emergency Contacts -->
          <div class="lg:col-span-3">
            <div class="grid grid-cols-1 justify-evenly gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="(emergency, idx) in emergencies" :key="idx" class="flex items-center">
                <div class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <i :class="`bx bx-${emergency.icon}`" class="text-lg"></i>
                </div>
                <div>
                  <p class="font-semibold">{{ emergency.nama }}</p>
                  <p class="text-sm text-red-100">{{ emergency.isi }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="lg:col-span-3">
            <div class="rounded text-center">
              <p class="text-white">Belum ada kontak emergency tersedia</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
