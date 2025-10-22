<script setup lang="ts">
import { AlertTriangle, FileText, Shield, Users } from "lucide-vue-next";
import { onMounted, ref } from "vue";

import PengaduanForm from "@/components/features/pengaduan/PengaduanForm.vue";
import PengaduanSessionStatus from "@/components/features/pengaduan/PengaduanSessionStatus.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { usePengaduanSession } from "@/composables/usePengaduanSession";

// Composables
const { cooldownStatus, setCooldown } = usePengaduanSession();

// State
const showForm = ref(true);

// Methods
const handleFormSuccess = () => {
  setCooldown();
  showForm.value = false;
};

const handleBackToForm = () => {
  showForm.value = true;
};

// Lifecycle
onMounted(() => {
  // Check if user is on cooldown
  if (cooldownStatus.value.isOnCooldown) {
    showForm.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container mx-auto px-4">
        <!-- Hero Section -->
        <div class="mb-12 text-center">
          <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <FileText class="h-8 w-8 text-yellow-600" />
          </div>
          <h1 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Pengaduan Masyarakat
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-gray-600">
            Sampaikan keluhan, saran, atau laporan Anda kepada kami. Tim kami akan segera memproses pengaduan Anda dengan sebaik-baiknya.
          </p>
        </div>

        <!-- Features -->
        <div class="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div class="rounded-lg bg-white p-6 shadow-md">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Shield class="h-6 w-6 text-blue-600" />
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">Aman & Terpercaya</h3>
            <p class="text-gray-600">Data pribadi Anda dilindungi dan hanya digunakan untuk keperluan pengaduan.</p>
          </div>

          <div class="rounded-lg bg-white p-6 shadow-md">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Users class="h-6 w-6 text-green-600" />
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">Responsif</h3>
            <p class="text-gray-600">Tim kami akan merespons pengaduan Anda dalam 1-3 hari kerja.</p>
          </div>

          <div class="rounded-lg bg-white p-6 shadow-md">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle class="h-6 w-6 text-yellow-600" />
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">Tindak Lanjut</h3>
            <p class="text-gray-600">Setiap pengaduan akan ditindaklanjuti sesuai dengan prosedur yang berlaku.</p>
          </div>
        </div>

        <!-- Form atau Session Status -->
        <div v-if="showForm">
          <PengaduanForm @success="handleFormSuccess" />
        </div>
        <div v-else>
          <PengaduanSessionStatus :on-back-to-form="handleBackToForm" />
        </div>
      </div>
    </main>
  </div>
</template>
