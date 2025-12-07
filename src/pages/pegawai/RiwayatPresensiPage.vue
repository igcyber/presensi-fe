<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import { AlertCircle, ArrowRight, Calendar as CalendarIcon, Clock, MapPin, Search } from "lucide-vue-next";
import moment from "moment";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import { getRiwayatPresensi } from "@/lib/api/services/presensi";
import type { RiwayatPresensiItem } from "@/lib/api/types/presensi.types";
import { cn } from "@/lib/utils";

const { time: formatTime, date: formatDate } = useFormatters();

// --- State ---
const isLoading = ref(false);
const riwayatList = ref<RiwayatPresensiItem[]>([]);

// Date Picker State (Default: Hari Ini)
const now = new Date();
const selectedDate = ref(new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()));

// Helper format tanggal display
const formatDisplayDate = (dateVal: CalendarDate | undefined) => {
  if (!dateVal) return "Pilih Tanggal";
  const jsDate = new Date(dateVal.year, dateVal.month - 1, dateVal.day);
  return moment(jsDate).format("DD MMMM YYYY");
};

// Helper URL Foto
// Karena backend mungkin hanya mengirim nama file, kita perlu construct URL-nya
// Sesuaikan BASE_URL dengan alamat backend Anda
const getFotoUrl = (filename: string, urlFromApi?: string) => {
  if (urlFromApi) return urlFromApi;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  // Asumsi path public backend: /api/file/absensi/{filename}
  // Sesuaikan path ini dengan controller backend Anda jika perlu
  return `${baseUrl}/api/file/absensi/${filename}`;
};

// --- Methods ---
const fetchData = async () => {
  try {
    isLoading.value = true;

    // Konversi CalendarDate ke YYYY-MM-DD
    const dateStr = selectedDate.value.toString();

    const response = await getRiwayatPresensi({ date: dateStr });
    riwayatList.value = response.data;
  } catch (error: any) {
    console.error(error);
    const msg = error?.response?.data?.message || "Gagal memuat riwayat absen.";
    // Jangan toast error 404 (data kosong), cukup kosongkan list
    riwayatList.value = [];
    if (error?.response?.status !== 404) {
      toast.error(msg);
    }
  } finally {
    isLoading.value = false;
  }
};

const getStatusVariant = (tipe: string) => {
  if (tipe.includes("MASUK")) return "default"; // Hitam/Primary
  if (tipe.includes("PULANG")) return "secondary"; // Abu-abu
  return "outline";
};

const getStatusLabel = (tipe: string) => {
  return tipe.replace("_", " "); // Ubah MASUK_LEMBUR jadi MASUK LEMBUR
};

const openMap = (lat: string, long: string) => {
  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${long}`, "_blank");
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="bg-background min-h-[80vh] p-4 md:p-6 lg:p-8">
    <div class="space-y-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Riwayat Harian</h1>
          <p class="text-muted-foreground">Detail aktivitas presensi pada tanggal tertentu.</p>
        </div>

        <Card class="w-full border-none bg-transparent shadow-none md:w-auto">
          <div class="flex flex-col items-end gap-2 md:flex-row">
            <div class="w-full space-y-1 md:w-64">
              <Label class="text-muted-foreground ml-1 text-xs">Pilih Tanggal</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'bg-background w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground',
                      )
                    "
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ formatDisplayDate(selectedDate) }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="end">
                  <Calendar v-model="selectedDate" mode="single" initial-focus />
                </PopoverContent>
              </Popover>
            </div>
            <Button @click="fetchData" :disabled="isLoading" class="w-full md:w-auto">
              <Search class="mr-2 h-4 w-4" /> Cari
            </Button>
          </div>
        </Card>
      </div>

      <Separator />

      <div v-if="isLoading" class="text-muted-foreground flex flex-col items-center justify-center py-20">
        <div class="border-primary mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p>Memuat riwayat...</p>
      </div>

      <div
        v-else-if="riwayatList.length === 0"
        class="text-muted-foreground bg-muted/10 flex flex-col items-center justify-center rounded-lg border border-dashed py-20"
      >
        <AlertCircle class="mb-3 h-12 w-12 opacity-20" />
        <p class="font-medium">Tidak ada data absensi</p>
        <p class="text-sm">Anda tidak memiliki catatan presensi pada tanggal ini.</p>
      </div>

      <div v-else class="mx-auto grid max-w-3xl gap-6">
        <div v-for="item in riwayatList" :key="item.id" class="relative pl-8 md:pl-0">
          <div class="bg-border absolute top-8 bottom-[-24px] left-[148px] hidden w-px last:hidden md:block"></div>

          <Card
            class="overflow-hidden border-l-4 transition-all hover:shadow-md"
            :class="item.tipe.includes('MASUK') ? 'border-l-green-500' : 'border-l-blue-500'"
          >
            <CardContent class="p-0">
              <div class="flex flex-col md:flex-row">
                <div
                  class="bg-muted/30 flex flex-row items-center justify-between gap-2 p-4 md:w-40 md:flex-col md:items-end md:justify-start md:border-r md:p-6"
                >
                  <Badge :variant="getStatusVariant(item.tipe) as any" class="mb-1">
                    {{ getStatusLabel(item.tipe) }}
                  </Badge>
                  <div class="text-foreground font-mono text-2xl font-bold">
                    {{ formatTime(item.tanggalAbsen) }}
                  </div>
                  <div class="text-muted-foreground text-xs md:text-right">
                    {{ formatDate(item.tanggalAbsen) }}
                  </div>
                </div>

                <div class="flex flex-1 flex-col gap-4 p-4 sm:flex-row md:p-6">
                  <div class="flex-shrink-0">
                    <div class="bg-muted relative h-32 w-32 overflow-hidden rounded-lg border">
                      <img
                        :src="getFotoUrl(item.foto, item.fotoUrl)"
                        alt="Foto Absen"
                        class="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                        @click="
                          () => {
                            /* Bisa tambah logic preview gambar full disini */
                          }
                        "
                        onerror="this.src='/placeholder.png'"
                      />
                    </div>
                  </div>

                  <div class="flex-1 space-y-3">
                    <div>
                      <p class="text-muted-foreground mb-1 flex items-center gap-1 text-sm font-medium">
                        <MapPin class="h-3.5 w-3.5" /> Koordinat Lokasi
                      </p>
                      <p class="bg-muted/50 w-fit rounded p-2 font-mono text-sm">{{ item.lat }}, {{ item.long }}</p>
                    </div>

                    <div class="flex items-center gap-4 text-sm">
                      <div>
                        <span class="text-muted-foreground">Akurasi:</span>
                        <span class="ml-1 font-medium">{{ item.akurasi }}m</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" class="h-8 gap-1" @click="openMap(item.lat, item.long)">
                      Buka Peta <ArrowRight class="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
