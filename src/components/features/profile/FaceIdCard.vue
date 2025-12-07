<script setup lang="ts">
import { Camera, CheckCircle, FlipHorizontal, Loader2, RefreshCcw, Save, XCircle } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useFormatters } from "@/composables/useFormatters";
import { usePresensiCamera } from "@/composables/usePresensiCamera";
import { checkFaceIdStatus, updateFaceId } from "@/lib/api/services/setting";
import type { FaceIdStatus } from "@/lib/api/types/setting.types";

const { date } = useFormatters();

// --- State Data ---
const status = ref<FaceIdStatus | null>(null);
const isLoading = ref(false);
const isUploading = ref(false);

// --- Composables ---
// Mengambil fungsi kamera & state mirror dari composable
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
} = usePresensiCamera(); // File object untuk upload

// --- API: Fetch Status ---
const fetchStatus = async () => {
  try {
    isLoading.value = true;
    const response = await checkFaceIdStatus();
    status.value = response.data;
  } catch (error) {
    console.error("Gagal memuat status Face ID", error);
  } finally {
    isLoading.value = false;
  }
};

// 5. Submit ke API
const submitPhoto = async () => {
  if (!capturedFile.value) return;

  try {
    isUploading.value = true;
    await updateFaceId(capturedFile.value);

    toast.success("Face ID berhasil diperbarui!");

    // Tutup kamera & refresh status
    stopCamera();
    await fetchStatus();
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Gagal mengupdate Face ID";
    toast.error(msg);
  } finally {
    isUploading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchStatus();
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Camera class="h-5 w-5" />
        Face ID
      </CardTitle>
      <CardDescription> Daftarkan wajah Anda untuk keperluan absensi harian. </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col items-center justify-center gap-6 py-4">
        <div v-if="isLoading" class="text-muted-foreground flex flex-col items-center gap-2">
          <Loader2 class="h-8 w-8 animate-spin" />
          <span class="text-sm">Memuat status...</span>
        </div>

        <template v-else>
          <div class="flex flex-col items-center gap-3">
            <div
              class="bg-opacity-10 flex h-20 w-20 items-center justify-center rounded-full transition-colors"
              :class="status?.is_registered ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
            >
              <CheckCircle v-if="status?.is_registered" class="h-10 w-10" />
              <XCircle v-else class="h-10 w-10" />
            </div>

            <div class="text-center">
              <h3 class="text-lg font-medium">
                {{ status?.is_registered ? "Sudah Terdaftar" : "Belum Terdaftar" }}
              </h3>
              <p v-if="status?.is_registered && status.registered_at" class="text-muted-foreground mt-1 text-xs">
                Diperbarui: {{ date(status.registered_at) }}
              </p>
              <p v-else class="text-muted-foreground mt-1 text-xs">
                Silakan lakukan pendaftaran wajah agar bisa melakukan presensi.
              </p>
            </div>
          </div>

          <Button
            class="w-full max-w-xs gap-2"
            :variant="status?.is_registered ? 'outline' : 'default'"
            @click="startCamera"
          >
            <Camera class="h-4 w-4" />
            {{ status?.is_registered ? "Update Wajah" : "Daftarkan Wajah" }}
          </Button>
        </template>
      </div>
    </CardContent>

    <Dialog :open="isCameraOpen" @update:open="(val) => !val && stopCamera()">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ambil Foto Wajah</DialogTitle>
          <DialogDescription> Posisikan wajah Anda di tengah bingkai kamera. </DialogDescription>
        </DialogHeader>

        <div class="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
          <video
            v-show="!capturedImage"
            ref="videoRef"
            autoplay
            playsinline
            class="h-full w-full object-cover transition-transform duration-300"
            :class="isMirrored ? '-scale-x-100' : 'scale-x-100'"
          ></video>

          <img v-if="capturedImage" :src="capturedImage" alt="Preview" class="h-full w-full object-cover" />

          <canvas ref="canvasRef" class="hidden"></canvas>

          <div v-if="!capturedImage" class="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div class="h-2/3 w-2/3 rounded-full border-2 border-dashed border-white/50"></div>
          </div>

          <div v-if="!capturedImage" class="pointer-events-auto absolute top-4 right-4 z-20">
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

        <DialogFooter class="flex-row gap-2 sm:justify-between">
          <Button variant="ghost" @click="stopCamera" :disabled="isUploading"> Batal </Button>

          <div class="flex gap-2">
            <Button v-if="!capturedImage" @click="() => takePhoto('face_id_register')">
              <Camera class="mr-2 h-4 w-4" />
              Ambil Foto
            </Button>

            <template v-else>
              <Button variant="outline" @click="retakePhoto" :disabled="isUploading">
                <RefreshCcw class="mr-2 h-4 w-4" />
                Ulangi
              </Button>
              <Button @click="submitPhoto" :disabled="isUploading">
                <Loader2 v-if="isUploading" class="mr-2 h-4 w-4 animate-spin" />
                <Save v-else class="mr-2 h-4 w-4" />
                {{ isUploading ? "Menyimpan..." : "Simpan" }}
              </Button>
            </template>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Card>
</template>
