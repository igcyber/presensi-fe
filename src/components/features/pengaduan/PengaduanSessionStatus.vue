<script setup lang="ts">
import { CheckCircle, Clock, RefreshCw } from "lucide-vue-next";
import { computed } from "vue";

import { usePengaduanSession } from "@/composables/usePengaduanSession";

// Props
const props = defineProps<{
  onBackToForm: () => void;
}>();

// Composables
const { cooldownStatus, cooldownTimeFormatted } = usePengaduanSession();

// Computed
const isCooldownActive = computed(() => cooldownStatus.value.isOnCooldown);
const canSubmitAgain = computed(() => !cooldownStatus.value.isOnCooldown);
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <!-- Success Message -->
    <div v-if="!isCooldownActive" class="overflow-hidden rounded-lg border border-green-200 bg-white shadow-md">
      <div class="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4">
        <div class="flex items-center">
          <CheckCircle class="h-8 w-8 text-green-600" />
          <div class="ml-3">
            <h2 class="text-xl font-semibold text-green-800">Pengaduan Berhasil Dikirim!</h2>
            <p class="mt-1 text-sm text-green-700">
              Terima kasih atas pengaduan Anda. Tim kami akan segera memprosesnya.
            </p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <CheckCircle class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Status Pengaduan</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>Pengaduan Anda telah berhasil diterima dan akan diproses dalam 1-3 hari kerja.</p>
                <p class="mt-1">Anda akan menerima notifikasi melalui email yang telah Anda berikan.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button
            @click="props.onBackToForm"
            class="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <RefreshCw class="mr-2 h-4 w-4" />
            Ajukan Pengaduan Lain
          </button>
        </div>
      </div>
    </div>

    <!-- Cooldown Status -->
    <div v-else class="overflow-hidden rounded-lg border border-yellow-200 bg-white shadow-md">
      <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4">
        <div class="flex items-center">
          <Clock class="h-8 w-8 text-yellow-600" />
          <div class="ml-3">
            <h2 class="text-xl font-semibold text-yellow-800">Pengaduan Sedang Diproses</h2>
            <p class="mt-1 text-sm text-yellow-700">
              Anda baru saja mengajukan pengaduan. Mohon tunggu sebelum mengajukan pengaduan berikutnya.
            </p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <!-- Countdown Timer -->
        <div class="rounded-md bg-yellow-50 p-6 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Clock class="h-8 w-8 text-yellow-600" />
          </div>

          <h3 class="text-lg font-semibold text-yellow-800">Waktu Tunggu</h3>
          <div class="mt-2 text-3xl font-bold text-yellow-600">
            {{ cooldownTimeFormatted }}
          </div>
          <p class="mt-2 text-sm text-yellow-700">
            Anda dapat mengajukan pengaduan kembali setelah waktu di atas habis
          </p>
        </div>

        <!-- Information -->
        <div class="mt-6 rounded-md bg-blue-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Informasi Penting</h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>Pengaduan Anda sedang dalam proses peninjauan</li>
                  <li>Tim kami akan menghubungi Anda jika diperlukan informasi tambahan</li>
                  <li>Status pengaduan akan dikirim melalui email</li>
                  <li>Untuk pengaduan mendesak, silakan hubungi call center</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Disabled Button -->
        <div class="mt-6 flex justify-center">
          <button
            disabled
            class="inline-flex items-center rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
          >
            <Clock class="mr-2 h-4 w-4" />
            Tunggu {{ cooldownTimeFormatted }} untuk pengaduan berikutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
