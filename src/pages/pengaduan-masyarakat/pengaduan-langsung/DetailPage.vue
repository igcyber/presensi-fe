<script setup lang="ts">
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Settings,
  User,
} from "lucide-vue-next";
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { getPengaduanPublicById } from "@/lib/api/services/pengaduan";
import type { PengaduanDetailResponse } from "@/lib/api/types/pengaduan.types";

const route = useRoute();
const router = useRouter();

const pengaduanId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

const { date } = useFormatters();
const { setContext, clearContext } = useBreadcrumb();

const { data, isLoading, isError, error, fetchData } = useFetch<any, PengaduanDetailResponse>(
  () => getPengaduanPublicById(pengaduanId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail pengaduan", {
        description: error.message,
      });
    },
  },
);

const statusConfig = computed(() => {
  if (!data.value) return { variant: "secondary" as const, label: "Unknown" };

  switch (data.value.status) {
    case "belum":
      return { variant: "secondary" as const, label: "Belum Diproses" };
    case "diterima":
      return { variant: "default" as const, label: "Diterima" };
    case "selesai":
      return { variant: "destructive" as const, label: "Selesai" };
    default:
      return { variant: "secondary" as const, label: "Unknown" };
  }
});

// Update breadcrumb context ketika data sudah ada
watch(
  () => data.value?.aduan,
  (aduan) => {
    if (aduan) {
      setContext(aduan);
    }
  },
  { immediate: true },
);

const handleBack = () => {
  router.push({ name: "pengaduan-masyarakat.pengaduan-langsung" });
};

onMounted(() => {
  if (pengaduanId.value > 0) {
    fetchData();
  } else {
    toast.error("ID pengaduan tidak valid");
    handleBack();
  }
});

onBeforeUnmount(() => {
  // Opsional: bersihkan agar tidak "nyangkut" ke halaman lain
  clearContext();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="border-portal-green mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p class="text-gray-600">Memuat data...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="mx-auto max-w-2xl">
          <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle class="text-destructive mx-auto mb-4 h-10 w-10" />
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
            <button
              class="inline-flex items-center rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              @click="fetchData"
            >
              <RefreshCw class="mr-2 h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="data">
          <!-- Back Button -->
          <div class="mb-6">
            <RouterLink
              :to="{ name: 'pengaduan-masyarakat.pengaduan-langsung' }"
              class="text-portal-green hover:text-portal-green/80 inline-flex items-center transition-colors duration-200"
            >
              <ChevronLeft class="mr-1 h-5 w-5" />
              Kembali ke Daftar Pengaduan
            </RouterLink>
          </div>

          <!-- Main Content -->
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Left Sidebar -->
            <div class="lg:col-span-1">
              <div class="space-y-6">
                <!-- Status Card -->
                <div class="overflow-hidden rounded bg-white shadow-md">
                  <div class="border-b border-gray-200 px-4 py-3">
                    <h3 class="text-lg font-semibold text-gray-900">
                      <Settings class="text-portal-green mr-2 h-4 w-4" />
                      Status Pengaduan
                    </h3>
                  </div>
                  <div class="p-4">
                    <div class="text-center">
                      <div
                        class="mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full"
                        :class="{
                          'bg-gray-100 text-gray-600': data.status === 'belum',
                          'bg-yellow-100 text-yellow-600': data.status === 'diterima',
                          'bg-green-100 text-green-600': data.status === 'selesai',
                        }"
                      >
                        <Settings class="h-8 w-8" />
                      </div>
                      <h4 class="mb-2 text-lg font-semibold text-gray-900">{{ statusConfig.label }}</h4>
                      <p class="text-sm text-gray-600">
                        {{
                          data.status === "belum"
                            ? "Menunggu proses"
                            : data.status === "diterima"
                              ? "Sedang diproses"
                              : "Telah selesai"
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Timeline Card -->
                <div class="overflow-hidden rounded bg-white shadow-md">
                  <div class="border-b border-gray-200 px-4 py-3">
                    <h3 class="text-lg font-semibold text-gray-900">
                      <Calendar class="text-portal-green mr-2 h-4 w-4" />
                      Timeline
                    </h3>
                  </div>
                  <div class="p-4">
                    <div class="space-y-4">
                      <div>
                        <label class="text-muted-foreground text-sm font-medium">Dibuat</label>
                        <p class="text-sm">
                          {{ data.createdAt ? new Date(data.createdAt).toLocaleString("id-ID") : "-" }}
                        </p>
                      </div>
                      <div v-if="data.updatedAt && data.updatedAt !== data.createdAt">
                        <label class="text-muted-foreground text-sm font-medium">Terakhir Diupdate</label>
                        <p class="text-sm">
                          {{ data.updatedAt ? new Date(data.updatedAt).toLocaleString("id-ID") : "-" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main Content Area -->
            <div class="lg:col-span-2">
              <div class="space-y-6">
                <!-- Pengaduan Header -->
                <div class="rounded bg-white p-6 shadow-md">
                  <div class="mb-4 flex items-center">
                    <FileText class="text-portal-green mr-3 h-6 w-6" />
                    <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">{{ data.aduan }}</h1>
                  </div>

                  <!-- Meta Information -->
                  <div class="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div class="flex items-center gap-1">
                      <Calendar class="h-4 w-4" />
                      <span>{{ date(data.createdAt) }}</span>
                    </div>
                    <div v-if="data.kategoriAduan" class="flex items-center gap-1">
                      <span class="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        {{ data.kategoriAduan }}
                      </span>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="max-w-none whitespace-pre-wrap text-gray-700">{{ data.deskripsi }}</div>
                </div>

                <!-- Informasi Pengadu -->
                <div class="rounded bg-white shadow-md">
                  <div class="border-b border-gray-200 px-6 py-4">
                    <h2 class="text-lg font-semibold text-gray-900">
                      <User class="text-portal-green mr-2 h-4 w-4" />
                      Informasi Pengadu
                    </h2>
                  </div>

                  <div class="p-6">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label class="text-muted-foreground text-sm font-medium">Nama Lengkap</label>
                        <p class="text-sm">{{ data.nama }}</p>
                      </div>
                      <div>
                        <label class="text-muted-foreground text-sm font-medium">NIK</label>
                        <p class="font-mono text-sm">{{ data.nik }}</p>
                      </div>
                      <div>
                        <label class="text-muted-foreground text-sm font-medium">No. HP</label>
                        <p class="flex items-center gap-1 text-sm">
                          <Phone class="h-4 w-4" />
                          {{ data.noHp }}
                        </p>
                      </div>
                      <div>
                        <label class="text-muted-foreground text-sm font-medium">Email</label>
                        <p class="flex items-center gap-1 text-sm">
                          <Mail class="h-4 w-4" />
                          {{ data.email }}
                        </p>
                      </div>
                    </div>
                    <div class="mt-4">
                      <label class="text-muted-foreground text-sm font-medium">Alamat</label>
                      <p class="flex items-start gap-1 text-sm">
                        <MapPin class="mt-0.5 h-4 w-4 flex-shrink-0" />
                        {{ data.alamat }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Status & Tindak Lanjut -->
                <div v-if="data.keterangan" class="rounded bg-white shadow-md">
                  <div class="border-b border-gray-200 px-6 py-4">
                    <h2 class="text-lg font-semibold text-gray-900">
                      <Settings class="text-portal-green mr-2 h-4 w-4" />
                      Tindak Lanjut
                    </h2>
                  </div>

                  <div class="p-6">
                    <div class="rounded-md bg-gray-50 p-4">
                      <p class="text-sm whitespace-pre-wrap text-gray-700">{{ data.keterangan }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
