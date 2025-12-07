<script setup lang="ts">
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  FlipHorizontal,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
} from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { toast } from "vue-sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useFormatters } from "@/composables/useFormatters";
// Import helpers, composables, servces, types
import { usePresensiCamera } from "@/composables/usePresensiCamera";
import { checkPermohonanStatus, getPresensiToday, submitPresensi } from "@/lib/api/services/presensi";
import type { PermohonanItem, PresensiStatusResponse } from "@/lib/api/types/presensi.types";
import { getDistanceInfo, getEarlyInfo, getLateInfo } from "@/lib/utils/presensiHelpers";

const { date, time } = useFormatters();

// --- Composables (Logika Kamera Baru) ---
const {
  isCameraOpen,
  isMirrored,
  toggleMirror,
  videoRef,
  canvasRef,
  capturedImage,
  capturedFile,
  startCamera,
  stopCamera,
  takePhoto,
  retakePhoto,
} = usePresensiCamera();

// --- State Data ---
const isLoading = ref(true);
const isSubmitting = ref(false);
const absenData = ref<PresensiStatusResponse | null>(null);
const currentDate = ref(new Date());
const activePermohonan = ref<PermohonanItem | null>(null);
const absenType = ref<"MASUK" | "PULANG">("MASUK");

// --- State Lokasi ---
const userLat = ref<number | null>(null);
const userLong = ref<number | null>(null);
const isLocationLoading = ref(false);
const locationError = ref<string | null>(null);

// --- Computed Properties ---
const kantor = computed(() => absenData.value?.kantor);

const riwayatMasuk = computed(() =>
  absenData.value?.riwayat.find((r) => r.tipe === "MASUK" || r.tipe === "MASUK_LEMBUR"),
);
const riwayatPulang = computed(() =>
  absenData.value?.riwayat.find((r) => r.tipe === "PULANG" || r.tipe === "PULANG_LEMBUR"),
);
const isCompleted = computed(() => !!riwayatMasuk.value && !!riwayatPulang.value);

// Computed Distance (Menggunakan Helper)
const distanceInfo = computed(() => getDistanceInfo(userLat.value, userLong.value, kantor.value as any));

// Computed Time Status (Menggunakan Helper)
const timeStatusInfo = computed(() => {
  if (absenType.value === "MASUK") {
    return getLateInfo(kantor.value?.jam_masuk, currentDate.value);
  } else {
    return getEarlyInfo(kantor.value?.jam_pulang, currentDate.value);
  }
});

// Helper Format Jam (Fix: Sebelumnya hilang)
const formatJamAbsen = (dateStr: string | undefined) => {
  return dateStr ? time(dateStr) : "-";
};

// --- API Methods ---
const fetchData = async () => {
  try {
    isLoading.value = true;
    const response = await getPresensiToday();
    absenData.value = response.data;
  } catch (error: any) {
    console.error(error);
    toast.error("Gagal memuat data presensi.");
  } finally {
    isLoading.value = false;
  }
};

const checkStatusIzin = async () => {
  try {
    const response = await checkPermohonanStatus();
    activePermohonan.value = response.data;
  } catch (error) {
    console.error("Gagal cek status izin", error);
  }
};

// --- Location Methods ---
const getLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = "Browser tidak mendukung Geolocation.";
    return;
  }

  isLocationLoading.value = true;
  locationError.value = null;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (pos.coords.accuracy > 100) {
        toast.warning(`Akurasi GPS rendah (${Math.round(pos.coords.accuracy)}m).`);
      }
      userLat.value = pos.coords.latitude;
      userLong.value = pos.coords.longitude;
      isLocationLoading.value = false;
    },
    (err) => {
      console.error(err);
      locationError.value = err.code === 1 ? "Izin lokasi ditolak." : "Lokasi tidak tersedia.";
      isLocationLoading.value = false;
      toast.error(locationError.value);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
  );
};

// --- Action Handlers ---
const handleOpenAbsen = (type: "MASUK" | "PULANG") => {
  if (!userLat.value || !userLong.value) {
    toast.error("Lokasi belum ditemukan. Refresh lokasi.");
    getLocation();
    return;
  }

  // Validasi Radius
  if (kantor.value && !kantor.value.except_user && !distanceInfo.value.inRadius) {
    toast.error(`Diluar jangkauan! Jarak: ${distanceInfo.value.distance}m (Max: ${kantor.value.radius_limit}m)`);
    return;
  }

  absenType.value = type;
  startCamera(); // Panggil composable
};

const doSubmitAbsen = async () => {
  if (!capturedFile.value || !userLat.value || !userLong.value) return;

  try {
    isSubmitting.value = true;

    await submitPresensi({
      tipe: absenType.value,
      lat: userLat.value.toString(),
      long: userLong.value.toString(),
      jarak: distanceInfo.value.distance || 0,
      image: capturedFile.value,
    });

    toast.success(`Berhasil Presensi ${absenType.value}!`);
    stopCamera();
    fetchData(); // Refresh data
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Gagal melakukan presensi.");
  } finally {
    isSubmitting.value = false;
  }
};

// --- Lifecycle ---
let clockInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  fetchData();
  getLocation();
  checkStatusIzin();

  clockInterval = setInterval(() => {
    currentDate.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(clockInterval);
  // stopCamera dipanggil otomatis oleh composable onUnmounted,
  // tapi aman dipanggil lagi disini
  stopCamera();
});
</script>

<template>
  <div class="bg-background min-h-[80vh] p-4 md:p-6 lg:p-8">
    <div class="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Presensi Harian</h1>
        <p class="text-muted-foreground">{{ date(currentDate) }}</p>
      </div>
      <div class="text-right">
        <p class="text-primary font-mono text-4xl font-bold">{{ time(currentDate) }}</p>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card class="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <MapPin class="h-5 w-5 text-blue-500" />
            Lokasi & Jadwal
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="kantor" class="bg-muted/50 rounded-lg p-4">
            <h3 class="text-lg font-semibold">{{ kantor.nama }}</h3>
            <p class="text-muted-foreground mb-3 text-sm">{{ kantor.alamat }}</p>

            <div class="mb-3 grid max-w-md grid-cols-2 gap-4">
              <div class="bg-background flex items-center gap-3 rounded border p-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded bg-green-100 text-xs font-bold text-green-600"
                >
                  IN
                </div>
                <div>
                  <p class="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">Jam Masuk</p>
                  <p class="text-sm font-medium">{{ kantor.jam_masuk ? kantor.jam_masuk.slice(0, 5) : "-" }}</p>
                </div>
              </div>
              <div class="bg-background flex items-center gap-3 rounded border p-2">
                <div class="flex h-8 w-8 items-center justify-center rounded bg-red-100 text-xs font-bold text-red-600">
                  OUT
                </div>
                <div>
                  <p class="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">Jam Pulang</p>
                  <p class="text-sm font-medium">{{ kantor.jam_pulang ? kantor.jam_pulang.slice(0, 5) : "-" }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <Badge variant="outline">Radius: {{ kantor.radius_limit }}m</Badge>
              <Badge v-if="kantor.except_user" variant="secondary" class="text-blue-600">Special Access</Badge>
            </div>
          </div>

          <div v-else-if="isLoading" class="space-y-2">
            <div class="bg-muted h-6 w-1/3 animate-pulse rounded"></div>
            <div class="bg-muted h-4 w-full animate-pulse rounded"></div>
          </div>
          <div v-else class="text-destructive text-sm font-medium">
            ⚠️ Anda belum terhubung ke kantor manapun. Hubungi admin.
          </div>

          <div class="flex items-center justify-between border-t pt-4">
            <div>
              <p class="text-muted-foreground text-sm">Jarak Anda:</p>
              <div v-if="distanceInfo.distance !== null" class="flex items-baseline gap-2">
                <span class="text-2xl font-bold" :class="distanceInfo.inRadius ? 'text-green-600' : 'text-red-600'">
                  {{ distanceInfo.distance }} Meter
                </span>
                <span v-if="!distanceInfo.inRadius && !kantor?.except_user" class="text-xs font-medium text-red-500">
                  (Diluar Radius)
                </span>
                <span v-else class="text-xs font-medium text-green-500"> (Dalam Jangkauan) </span>
              </div>
              <div v-else-if="locationError" class="text-destructive text-sm">
                {{ locationError }}
              </div>
              <div v-else class="text-muted-foreground flex items-center gap-2">
                <Loader2 class="h-4 w-4 animate-spin" /> Mencari lokasi...
              </div>
            </div>

            <Button variant="outline" size="sm" @click="getLocation" :disabled="isLocationLoading">
              <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isLocationLoading }" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Hari Ini</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex items-center justify-between rounded-md border p-3">
            <span class="text-sm font-medium">Jam Masuk</span>
            <span v-if="riwayatMasuk" class="font-bold text-green-600">
              {{ formatJamAbsen(riwayatMasuk.tanggalAbsen) }}
            </span>
            <span v-else class="text-muted-foreground">-</span>
          </div>

          <div class="flex items-center justify-between rounded-md border p-3">
            <span class="text-sm font-medium">Jam Pulang</span>
            <span v-if="riwayatPulang" class="font-bold text-blue-600">
              {{ formatJamAbsen(riwayatPulang.tanggalAbsen) }}
            </span>
            <span v-else class="text-muted-foreground">-</span>
          </div>

          <div class="mt-4">
            <div
              v-if="activePermohonan && activePermohonan.status === 'diterima'"
              class="rounded-r-md border-l-4 border-green-500 bg-green-50 p-4"
            >
              <div class="flex gap-3">
                <div class="flex-1">
                  <p class="font-bold text-green-700">Pengajuan Disetujui ({{ activePermohonan.tipe }})</p>
                  <p class="mt-1 text-sm text-green-600">Anda tidak perlu melakukan presensi hari ini.</p>
                </div>
              </div>
            </div>

            <div v-else class="space-y-2">
              <div
                v-if="activePermohonan && (!activePermohonan.status || activePermohonan.status === 'pending')"
                class="mb-3 flex items-center gap-2 rounded border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-700"
              >
                <Loader2 class="h-3 w-3 animate-spin" />
                <span>Pengajuan {{ activePermohonan.tipe }} sedang diproses. Silakan melakukan presensi.</span>
              </div>

              <template v-if="isLoading">
                <Button disabled class="w-full">Memuat...</Button>
              </template>

              <template v-else-if="!kantor">
                <Button disabled variant="destructive" class="w-full">Tidak Ada Jadwal</Button>
              </template>

              <template v-else-if="isCompleted">
                <Button disabled variant="secondary" class="w-full bg-green-100 text-green-800 hover:bg-green-100">
                  ✅ Selesai Hari Ini
                </Button>
              </template>

              <template v-else-if="riwayatMasuk">
                <Button class="w-full bg-blue-600 text-white hover:bg-blue-700" @click="handleOpenAbsen('PULANG')">
                  <Navigation class="mr-2 h-4 w-4 rotate-180" />
                  Presensi Pulang
                </Button>
              </template>

              <template v-else>
                <Button class="w-full bg-green-600 text-white hover:bg-green-700" @click="handleOpenAbsen('MASUK')">
                  <Navigation class="mr-2 h-4 w-4" />
                  Presensi Masuk
                </Button>
              </template>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog :open="isCameraOpen" @update:open="(val) => !val && stopCamera()">
      <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader class="p-4 pb-2">
          <DialogTitle>Presensi {{ absenType }}</DialogTitle>
        </DialogHeader>

        <div class="px-4 pb-2">
          <div
            v-if="timeStatusInfo?.isLate"
            class="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"
          >
            <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <span class="font-bold">Anda Terlambat!</span>
              <p class="mt-0.5 text-xs text-amber-600">
                Jadwal masuk {{ kantor?.jam_masuk?.slice(0, 5) }}. Terlambat {{ timeStatusInfo.text }}.
              </p>
            </div>
          </div>

          <div
            v-else-if="timeStatusInfo?.isEarly"
            class="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700"
          >
            <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <span class="font-bold">Pulang Lebih Awal?</span>
              <p class="mt-0.5 text-xs text-blue-600">
                Jadwal pulang {{ kantor?.jam_pulang?.slice(0, 5) }}. Kurang {{ timeStatusInfo.text }}.
              </p>
            </div>
          </div>

          <div
            v-else
            class="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
          >
            <CheckCircle2 class="h-4 w-4 shrink-0" />
            <span class="font-medium">Waktu Anda Sesuai Jadwal</span>
          </div>
        </div>

        <div class="relative aspect-[3/4] w-full overflow-hidden bg-black sm:aspect-square">
          <video
            v-show="!capturedImage"
            ref="videoRef"
            autoplay
            playsinline
            class="h-full w-full object-cover transition-transform duration-300"
            :class="isMirrored ? '-scale-x-100' : 'scale-x-100'"
          ></video>

          <img v-if="capturedImage" :src="capturedImage" class="h-full w-full object-cover" />

          <canvas ref="canvasRef" class="hidden"></canvas>

          <div v-if="!capturedImage" class="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div class="h-64 w-48 rounded-full border-2 border-dashed border-white/70 sm:h-64 sm:w-64"></div>
          </div>

          <div v-if="!capturedImage" class="absolute top-4 right-4 z-20">
            <Button
              size="icon"
              variant="secondary"
              class="h-10 w-10 rounded-full border-none bg-black/50 text-white hover:bg-black/70"
              @click="toggleMirror"
              title="Mirror Kamera"
            >
              <FlipHorizontal class="h-5 w-5" />
            </Button>
          </div>
        </div>

        <DialogFooter class="bg-background p-4">
          <div class="flex w-full justify-between gap-2">
            <Button variant="ghost" @click="stopCamera" :disabled="isSubmitting">Batal</Button>

            <div class="flex gap-2">
              <Button v-if="!capturedImage" @click="() => takePhoto('presensi_' + absenType)">
                <Camera class="mr-2 h-4 w-4" /> Ambil Foto
              </Button>
              <template v-else>
                <Button variant="outline" @click="retakePhoto" :disabled="isSubmitting">Ulangi</Button>
                <Button @click="doSubmitAbsen" :disabled="isSubmitting">
                  <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                  {{ isSubmitting ? "Mengirim..." : "Kirim Presensi" }}
                </Button>
              </template>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
