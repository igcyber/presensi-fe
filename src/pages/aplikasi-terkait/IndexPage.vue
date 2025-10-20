<script setup lang="ts">
import { AlertCircle, ExternalLink, Info, RefreshCw } from "lucide-vue-next";
import { onMounted, ref } from "vue";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { Card, CardContent } from "@/components/ui/card";
import DynamicIcon from "@/components/ui/DynamicIcon.vue";

// import { getAplikasiTerkait } from "@/lib/api/services/aplikasiTerkait";
// import type { AplikasiTerkait } from "@/lib/api/types/aplikasiTerkait.types";

// Temporary mock data until API is available
interface AplikasiTerkait {
  id: number;
  nama: string;
  deskripsi: string;
  url: string;
  icon?: string;
  iconBgClass?: string;
}

// State
const aplikasiList = ref<AplikasiTerkait[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Methods
const fetchAplikasiList = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Mock data until API is available
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    aplikasiList.value = [
      {
        id: 1,
        nama: "E-KTP Online",
        deskripsi: "Layanan pembuatan KTP elektronik secara online",
        url: "https://ektp.kutaikartanegara.go.id",
        icon: "bx-id-card",
        iconBgClass: "from-blue-500 to-blue-600",
      },
      {
        id: 2,
        nama: "SIKDA",
        deskripsi: "Sistem Informasi Kesehatan Daerah",
        url: "https://sikda.kutaikartanegara.go.id",
        icon: "bx-heart",
        iconBgClass: "from-red-500 to-red-600",
      },
      {
        id: 3,
        nama: "E-Planning",
        deskripsi: "Sistem perencanaan pembangunan daerah",
        url: "https://eplanning.kutaikartanegara.go.id",
        icon: "bx-map",
        iconBgClass: "from-green-500 to-green-600",
      },
      {
        id: 4,
        nama: "E-Budgeting",
        deskripsi: "Sistem penganggaran daerah",
        url: "https://ebudgeting.kutaikartanegara.go.id",
        icon: "bx-money",
        iconBgClass: "from-yellow-500 to-yellow-600",
      },
    ];
  } catch (err: any) {
    console.error("Error fetching aplikasi terkait:", err);
    error.value = err?.response?.data?.message || "Gagal memuat data aplikasi terkait";
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchAplikasiList();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-bold text-gray-900">Aplikasi Terkait</h1>
          <p class="text-lg text-gray-600">Akses berbagai aplikasi dan layanan digital Sekretariat DPRD Kutai Kartanegara</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
            <p class="text-gray-600">Memuat data aplikasi terkait...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="mx-auto max-w-2xl">
          <Card>
            <CardContent class="p-8 text-center">
              <AlertCircle class="text-destructive mx-auto mb-4 h-10 w-10" />
              <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
              <p class="mb-6 text-red-700">{{ error }}</p>
              <button
                @click="fetchAplikasiList"
                class="inline-flex items-center rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              >
                <RefreshCw class="mr-2 h-4 w-4" />
                Coba Lagi
              </button>
            </CardContent>
          </Card>
        </div>

        <!-- Grid Aplikasi -->
        <div v-else-if="aplikasiList.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card
            v-for="aplikasi in aplikasiList"
            :key="aplikasi.id"
            class="group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <CardContent class="p-6">
              <div class="mb-4 flex items-center justify-center">
                <div
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br"
                  :class="aplikasi.iconBgClass || 'from-yellow-500 to-yellow-600'"
                >
                  <DynamicIcon :name="aplikasi.icon || 'bx-link-external'" icon-class="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 class="mb-2 text-center text-lg font-semibold">{{ aplikasi.nama }}</h3>
              <p class="mb-4 text-center text-sm text-gray-600">{{ aplikasi.deskripsi }}</p>
              <a
                :href="aplikasi.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700"
              >
                Buka Aplikasi
                <ExternalLink class="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="mx-auto max-w-2xl">
          <Card>
            <CardContent class="p-8 text-center">
              <Info class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
              <h4 class="mb-4 text-xl font-semibold text-yellow-800">Data Tidak Tersedia</h4>
              <p class="text-yellow-700">Belum ada aplikasi terkait yang tersedia saat ini.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
