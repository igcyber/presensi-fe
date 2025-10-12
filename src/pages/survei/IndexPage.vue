<script setup lang="ts">
import { onMounted } from "vue";

import SurveiForm from "@/components/features/survei/SurveiForm.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useSurvei } from "@/composables/useSurvei";

// Menggunakan composable
const {
  layananList,
  kuesionerList,
  isLoading,
  error,
  cooldownStatus,
  cooldownTimeFormatted,
  fetchLayananList,
  fetchKuesionerList,
  checkCooldownStatus,
} = useSurvei();

onMounted(async () => {
  await Promise.all([fetchLayananList(), fetchKuesionerList(), checkCooldownStatus()]);
});

const handleSubmit = () => {
  checkCooldownStatus();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="mb-4 text-3xl font-bold text-gray-900">Survei Kepuasan Masyarakat</h1>
          <p class="text-lg text-gray-600">Berikan penilaian Anda terhadap kualitas pelayanan yang telah Anda terima</p>
          <p class="mt-2 text-sm text-gray-500">
            <i class="bx bx-info-circle mr-1"></i>
            Setelah submit survei, Anda harus menunggu 30 menit sebelum dapat mengisi survei lagi
          </p>
        </div>

        <!-- Cooldown Warning -->
        <div v-if="cooldownStatus.isOnCooldown" class="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-6">
          <div class="flex items-center justify-center gap-3">
            <i class="bx bx-time text-2xl text-orange-600"></i>
            <div class="text-center">
              <h3 class="text-lg font-semibold text-orange-800">Survei Sedang dalam Cooldown</h3>
              <p class="text-orange-700">
                Anda dapat mengisi survei lagi dalam
                <span class="font-mono text-xl font-bold text-orange-900">{{ cooldownTimeFormatted }}</span>
                <br />
                <small class="text-orange-600">Cooldown: 30 menit setelah submit survei</small>
              </p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="border-portal-green mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p class="text-gray-600">Memuat data survei...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="mx-auto max-w-2xl">
          <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
            <i class="bx bx-error-circle text-destructive mb-4 text-4xl"></i>
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ error }}</p>
            <button
              class="rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              @click="
                fetchLayananList();
                fetchKuesionerList();
              "
            >
              <i class="bx bx-refresh mr-2"></i>
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Survey Form -->
        <div v-else-if="!cooldownStatus.isOnCooldown" class="mx-auto max-w-4xl">
          <SurveiForm :layanan-list="layananList" :kuesioner-list="kuesionerList" @submit="handleSubmit" />
        </div>

        <!-- Empty State -->
        <div v-else-if="layananList.length === 0" class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <i class="bx bx-info-circle mb-4 text-4xl text-yellow-600"></i>
            <h4 class="mb-4 text-xl font-semibold text-yellow-600">Data Tidak Ditemukan</h4>
            <p class="text-yellow-700">Maaf, tidak ada layanan yang tersedia untuk survei saat ini.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
