<script setup lang="ts">
import { Camera, Loader2, MapPin, Navigation, RefreshCw } from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { toast } from "vue-sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useFormatters } from "@/composables/useFormatters";
import { getPresensiToday, submitPresensi } from "@/lib/api/services/presensi";
import type { PresensiStatusResponse } from "@/lib/api/types/presensi.types";
import { calculateDistance } from "@/lib/utils/helper";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const { date, time } = useFormatters();

// --- State Data ---
const isLoading = ref(true);
const isSubmitting = ref(false);
const absenData = ref<PresensiStatusResponse | null>(null);
const currentDate = ref(new Date());

// --- State Lokasi ---
const userLat = ref<number | null>(null);
const userLong = ref<number | null>(null);
const distanceToOffice = ref<number | null>(null);
const isLocationLoading = ref(false);
const locationError = ref<string | null>(null);

// --- State Kamera ---
const isCameraOpen = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);
const capturedImage = ref<string | null>(null);
const capturedFile = ref<File | null>(null);
const absenType = ref<"MASUK" | "PULANG">("MASUK");

// --- Computed ---
const kantor = computed(() => absenData.value?.kantor);
const riwayatMasuk = computed(() =>
  absenData.value?.riwayat.find((r) => r.tipe === "MASUK" || r.tipe === "MASUK_LEMBUR"),
);
const riwayatPulang = computed(() =>
  absenData.value?.riwayat.find((r) => r.tipe === "PULANG" || r.tipe === "PULANG_LEMBUR"),
);

// Cek apakah sudah selesai absen hari ini
const isCompleted = computed(() => !!riwayatMasuk.value && !!riwayatPulang.value);

// Cek apakah dalam radius (jika kantor ada)
const isInRadius = computed(() => {
  if (!kantor.value || distanceToOffice.value === null) return false;
  return distanceToOffice.value <= kantor.value.radius_limit;
});

// --- API Methods ---
const fetchData = async () => {
  try {
    isLoading.value = true;
    const response = await getPresensiToday();
    absenData.value = response.data;

    // Setelah data kantor didapat, hitung ulang jarak (jika lokasi user sudah ada)
    if (userLat.value && userLong.value && kantor.value) {
      calculateDistanceToOffice();
    }
  } catch (error: any) {
    console.error(error);
    toast.error("Gagal memuat data presensi.");
  } finally {
    isLoading.value = false;
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
    (position) => {
      userLat.value = position.coords.latitude;
      userLong.value = position.coords.longitude;
      isLocationLoading.value = false;

      calculateDistanceToOffice();
    },
    (error) => {
      console.error("Error location:", error);
      let msg = "Gagal mengambil lokasi.";
      if (error.code === 1) msg = "Izin lokasi ditolak. Mohon aktifkan GPS.";
      else if (error.code === 2) msg = "Lokasi tidak tersedia.";
      else if (error.code === 3) msg = "Waktu permintaan lokasi habis.";

      locationError.value = msg;
      isLocationLoading.value = false;
      toast.error(msg);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  );
};

const calculateDistanceToOffice = () => {
  if (userLat.value && userLong.value && kantor.value) {
    const dist = calculateDistance(
      userLat.value,
      userLong.value,
      parseFloat(kantor.value.lat),
      parseFloat(kantor.value.long),
    );
    distanceToOffice.value = dist;
  }
};

// --- Camera Methods ---
const openAbsenModal = (type: "MASUK" | "PULANG") => {
  if (!userLat.value || !userLong.value) {
    toast.error("Lokasi belum ditemukan. Mohon refresh lokasi.");
    getLocation();
    return;
  }

  // Validasi Radius (Kecuali user yang dikecualikan)
  if (kantor.value && !kantor.value.except_user && !isInRadius.value) {
    toast.error(`Anda berada di luar radius kantor (${distanceToOffice.value}m). Maks: ${kantor.value.radius_limit}m`);
    return;
  }

  absenType.value = type;
  isCameraOpen.value = true;
  startCamera();
};

const startCamera = async () => {
  try {
    capturedImage.value = null;
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
    });
    if (videoRef.value) videoRef.value.srcObject = stream.value;
  } catch (err) {
    console.error(err);
    toast.error("Gagal mengakses kamera.");
    isCameraOpen.value = false;
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((t) => t.stop());
    stream.value = null;
  }
  isCameraOpen.value = false;
};

const takePhoto = () => {
  if (videoRef.value && canvasRef.value) {
    const video = videoRef.value;
    const canvas = canvasRef.value;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      capturedImage.value = canvas.toDataURL("image/jpeg");
      canvas.toBlob(
        (blob) => {
          if (blob) {
            capturedFile.value = new File([blob], `absen_${absenType.value}.jpg`, { type: "image/jpeg" });
          }
        },
        "image/jpeg",
        0.8,
      );
    }
  }
};

// Helper khusus untuk memparsing tanggal_absen dari backend
const formatJamAbsen = (dateStr: string | undefined) => {
  if (!dateStr) return "-";
  // Gunakan formatter 'time' yang sudah ada, atau format manual
  return time(dateStr);
};

const retakePhoto = () => {
  capturedImage.value = null;
  capturedFile.value = null;
};

const doSubmitAbsen = async () => {
  if (!capturedFile.value || !userLat.value || !userLong.value) return;

  try {
    isSubmitting.value = true;

    await submitPresensi({
      tipe: absenType.value,
      lat: userLat.value.toString(),
      long: userLong.value.toString(),
      jarak: distanceToOffice.value || 0,
      image: capturedFile.value,
    });

    toast.success(`Berhasil Presensi ${absenType.value}!`);
    stopCamera();
    fetchData(); // Refresh data
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Gagal melakukan presensi.";
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};

// --- Lifecycle ---
let clockInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  fetchData();
  getLocation();

  // Jam real-time
  clockInterval = setInterval(() => {
    currentDate.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(clockInterval);
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
            Lokasi & Kantor
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="kantor" class="bg-muted/50 rounded-lg p-4">
            <h3 class="text-lg font-semibold">{{ kantor.nama }}</h3>
            <p class="text-muted-foreground text-sm">{{ kantor.alamat }}</p>
            <div class="mt-2 flex items-center gap-2 text-sm">
              <Badge variant="outline">Radius: {{ kantor.radius_limit }}m</Badge>
              <Badge v-if="kantor.except_user" variant="secondary" class="text-blue-600">Special Access</Badge>
            </div>
          </div>
          <div v-else-if="isLoading" class="space-y-2">
            <div class="bg-muted h-6 w-1/3 animate-pulse rounded"></div>
            <div class="bg-muted h-4 w-full animate-pulse rounded"></div>
          </div>
          <div v-else class="text-sm text-red-500">Anda belum terhubung ke kantor manapun. Hubungi admin.</div>

          <div class="flex items-center justify-between border-t pt-4">
            <div>
              <p class="text-muted-foreground text-sm">Jarak Anda ke Kantor:</p>
              <div v-if="distanceToOffice !== null" class="flex items-baseline gap-2">
                <span class="text-2xl font-bold" :class="isInRadius ? 'text-green-600' : 'text-red-600'">
                  {{ distanceToOffice }} Meter
                </span>
                <span v-if="!isInRadius && !kantor?.except_user" class="text-xs font-medium text-red-500">
                  (Diluar Radius)
                </span>
                <span v-else class="text-xs font-medium text-green-500"> (Dalam Jangkauan) </span>
              </div>
              <div v-else-if="locationError" class="text-sm text-red-500">
                {{ locationError }}
              </div>
              <div v-else class="text-muted-foreground flex items-center gap-2">
                <Loader2 class="h-4 w-4 animate-spin" /> Mencari lokasi...
              </div>
            </div>

            <Button variant="outline" size="sm" @click="getLocation" :disabled="isLocationLoading">
              <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isLocationLoading }" />
              Refresh Lokasi
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
            <span v-if="riwayatMasuk" class="font-bold text-green-600">{{
              formatJamAbsen(riwayatMasuk.tanggalAbsen)
            }}</span>
            <span v-else class="text-muted-foreground">-</span>
          </div>

          <div class="flex items-center justify-between rounded-md border p-3">
            <span class="text-sm font-medium">Jam Pulang</span>
            <span v-if="riwayatPulang" class="font-bold text-blue-600">{{
              formatJamAbsen(riwayatPulang.tanggalAbsen)
            }}</span>
            <span v-else class="text-muted-foreground">-</span>
          </div>

          <div class="mt-4">
            <template v-if="isLoading">
              <Button disabled class="w-full">Memuat...</Button>
            </template>

            <template v-else-if="!kantor">
              <Button disabled variant="destructive" class="w-full">Tidak Ada Jadwal</Button>
            </template>

            <template v-else-if="isCompleted">
              <Button disabled variant="secondary" class="w-full bg-green-100 text-green-800">
                Selesai (Sudah Pulang)
              </Button>
            </template>

            <template v-else-if="riwayatMasuk">
              <Button class="w-full bg-blue-600 text-white hover:bg-blue-700" @click="openAbsenModal('PULANG')">
                <Navigation class="mr-2 h-4 w-4 rotate-180" />
                Presensi Pulang
              </Button>
            </template>

            <template v-else>
              <Button class="w-full bg-green-600 text-white hover:bg-green-700" @click="openAbsenModal('MASUK')">
                <Navigation class="mr-2 h-4 w-4" />
                Presensi Masuk
              </Button>
            </template>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog :open="isCameraOpen" @update:open="(val) => !val && stopCamera()">
      <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader class="p-4 pb-2">
          <DialogTitle>Absen {{ absenType }}</DialogTitle>
        </DialogHeader>

        <div class="relative aspect-[3/4] w-full bg-black sm:aspect-square">
          <video
            v-show="!capturedImage"
            ref="videoRef"
            autoplay
            playsinline
            class="h-full w-full -scale-x-100 transform object-cover"
          ></video>

          <img v-if="capturedImage" :src="capturedImage" class="h-full w-full -scale-x-100 transform object-cover" />

          <canvas ref="canvasRef" class="hidden"></canvas>

          <div v-if="!capturedImage" class="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div class="h-64 w-48 rounded-full border-2 border-dashed border-white/70 sm:h-64 sm:w-64"></div>
          </div>
        </div>

        <DialogFooter class="bg-background p-4">
          <div class="flex w-full justify-between gap-2">
            <Button variant="ghost" @click="stopCamera" :disabled="isSubmitting">Batal</Button>

            <div class="flex gap-2">
              <Button v-if="!capturedImage" @click="takePhoto"> <Camera class="mr-2 h-4 w-4" /> Ambil Foto </Button>
              <template v-else>
                <Button variant="outline" @click="retakePhoto" :disabled="isSubmitting">Ulangi</Button>
                <Button @click="doSubmitAbsen" :disabled="isSubmitting">
                  <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                  {{ isSubmitting ? "Mengirim..." : "Kirim Absen" }}
                </Button>
              </template>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
