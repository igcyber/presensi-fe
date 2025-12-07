<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import { AlertCircle, Calendar as CalendarIcon, Filter, Search, User, X } from "lucide-vue-next";
import { FileText } from "lucide-vue-next";
import moment from "moment";
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useFormatters } from "@/composables/useFormatters";
import { getListPegawai } from "@/lib/api/services/pegawai";
import { getRekapPresensiAdmin } from "@/lib/api/services/presensi";
import type { RekapPresensiAdminParams, RekapPresensiAdminResponse } from "@/lib/api/types/presensi.types";
import type { Pegawai } from "@/lib/api/types/pegawai.types";
import { cn } from "@/lib/utils";
import { generateRekapWord } from "@/lib/utils/exportWord";
import { getYearOptions, monthOptions } from "@/lib/utils/helper";

const { date: formatDate } = useFormatters();

// --- State ---
const isLoading = ref(false);
const isLoadingPegawai = ref(false);
const rekapData = ref<RekapPresensiAdminResponse | null>(null);
const pegawaiList = ref<Pegawai[]>([]);
const selectedPegawaiId = ref<number | null>(null);
const searchPegawaiQuery = ref("");
const isSelectPegawaiOpen = ref(false);

// Filter State
const filterType = ref<"bulanan" | "range">("bulanan"); // Default bulanan

// State Bulanan
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const selectedMonth = ref(currentMonth.toString());
const selectedYear = ref(currentYear.toString());

// State Range (Default: Tanggal 1 s/d Hari ini)
// Kita konversi ke string YYYY-MM-DD saat kirim ke API
const now = new Date();
const startCalendarDate = ref(new CalendarDate(now.getFullYear(), now.getMonth() + 1, 1));
const endCalendarDate = ref(new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()));

// --- Computed ---
const detailList = computed(() => {
  if (!rekapData.value?.detail_harian) return [];
  // Konversi Object response backend ke Array agar bisa di-sort/map
  return Object.values(rekapData.value.detail_harian);
});

const filteredPegawaiList = computed(() => {
  if (!searchPegawaiQuery.value.trim()) {
    return pegawaiList.value;
  }
  const query = searchPegawaiQuery.value.toLowerCase().trim();
  return pegawaiList.value.filter((pegawai) => pegawai.nama.toLowerCase().includes(query));
});

const pegawaiInfo = computed(() => {
  if (!rekapData.value?.pegawai) return null;
  return {
    nama: rekapData.value.pegawai.nama,
    tipePegawai: rekapData.value.pegawai.tipePegawai,
  };
});

const periodeInfo = computed(() => {
  if (!rekapData.value?.periode) return null;
  return {
    start_date: rekapData.value.periode.start_date,
    end_date: rekapData.value.periode.end_date,
  };
});

// Helper format tanggal untuk display di button
const formatDisplayDate = (dateVal: CalendarDate | undefined) => {
  if (!dateVal) return "Pilih Tanggal";
  // Konversi CalendarDate ke JS Date untuk diformat moment
  const jsDate = new Date(dateVal.year, dateVal.month - 1, dateVal.day);
  return moment(jsDate).format("DD MMMM YYYY");
};

// Fungsi Handle Export
const handleExport = async () => {
  if (!rekapData.value) {
    toast.error("Tidak ada data untuk diexport");
    return;
  }

  try {
    const labelPeriode = `${formatDate(rekapData.value.periode.start_date)} - ${formatDate(rekapData.value.periode.end_date)}`;
    // Convert admin response to old format for export
    const exportData = {
      pegawai: {
        nama: rekapData.value.pegawai.nama,
        tipe_pegawai: rekapData.value.pegawai.tipePegawai,
      },
      periode: {
        awal: rekapData.value.periode.start_date,
        akhir: rekapData.value.periode.end_date,
      },
      detail: rekapData.value.detail_harian,
    };
    await generateRekapWord(exportData, labelPeriode);
    toast.success("File Word berhasil diunduh");
  } catch (e) {
    console.error(e);
    toast.error("Gagal membuat file Word");
  }
};

// --- Methods ---
const fetchPegawaiList = async () => {
  try {
    isLoadingPegawai.value = true;
    const response = await getListPegawai();
    pegawaiList.value = response.data;
  } catch (error: any) {
    console.error(error);
    toast.error("Gagal memuat daftar pegawai.");
  } finally {
    isLoadingPegawai.value = false;
  }
};

const fetchData = async () => {
  if (!selectedPegawaiId.value) {
    toast.error("Pilih pegawai terlebih dahulu");
    rekapData.value = null;
    return;
  }

  try {
    isLoading.value = true;
    // Clear data lama sebelum fetch baru
    rekapData.value = null;

    // Siapkan Parameter API
    const params: RekapPresensiAdminParams = {
      pegawai_id: typeof selectedPegawaiId.value === "string" ? parseInt(selectedPegawaiId.value) : selectedPegawaiId.value,
      tipe: filterType.value,
    };

    if (filterType.value === "bulanan") {
      params.month = parseInt(selectedMonth.value);
      params.year = parseInt(selectedYear.value);
    } else {
      // Konversi CalendarDate ke string YYYY-MM-DD
      params.start_date = startCalendarDate.value.toString();
      params.end_date = endCalendarDate.value.toString();

      // Validasi sederhana
      if (params.start_date > params.end_date) {
        toast.error("Tanggal mulai tidak boleh lebih besar dari tanggal selesai");
        isLoading.value = false;
        return;
      }
    }

    const response = await getRekapPresensiAdmin(params);
    // Assign dengan object baru untuk memastikan reactivity
    rekapData.value = { ...response.data };

    // Debug: log untuk memastikan data ter-update
    console.log("Data rekap ter-update:", {
      pegawai_id: params.pegawai_id,
      nama: response.data.pegawai.nama,
      tipePegawai: response.data.pegawai.tipePegawai,
    });
  } catch (error: any) {
    console.error(error);
    toast.error("Gagal memuat data rekap presensi.");
  } finally {
    isLoading.value = false;
  }
};

// Helper untuk mengambil jam masuk dari array data_absen
const getJamMasuk = (items: any[]) => {
  const absen = items.find((i) => i.tipe === "MASUK" || i.tipe === "MASUK_LEMBUR");
  return absen ? absen.jam : "-";
};

// Helper untuk mengambil jam pulang dari array data_absen
const getJamPulang = (items: any[]) => {
  const absen = items.find((i) => i.tipe === "PULANG" || i.tipe === "PULANG_LEMBUR");
  return absen ? absen.jam : "-";
};

// Helper warna badge status
const getStatusColor = (status: string) => {
  switch (status) {
    case "Hadir":
      return "default"; // Hitam/Primary
    case "Izin":
      return "secondary"; // Abu-abu
    case "Sakit":
      return "secondary";
    case "Cuti":
      return "secondary";
    case "Libur":
      return "outline";
    case "Tanggal Merah":
      return "destructive"; // Merah
    case "Tanpa Keterangan":
      return "outline";
    default:
      return "outline";
  }
};

// Format tanggal custom (Hari, DD MMM YYYY)
const formatTanggalLengkap = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Watch untuk clear data ketika pegawai berubah
watch(selectedPegawaiId, () => {
  rekapData.value = null;
});

// Watch untuk clear search ketika select ditutup
watch(isSelectPegawaiOpen, (isOpen) => {
  if (!isOpen) {
    searchPegawaiQuery.value = "";
  }
});

onMounted(() => {
  fetchPegawaiList();
});
</script>

<template>
  <div class="bg-background min-h-[80vh] p-4 md:p-6 lg:p-8">
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Rekap Presensi</h1>
        <p class="text-muted-foreground">Laporan kehadiran Anda.</p>
      </div>

      <Card class="border shadow-sm">
        <CardContent class="p-6">
          <div class="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
            <div class="space-y-2 md:col-span-3">
              <Label class="text-sm font-medium">Pegawai</Label>
              <Select
                :model-value="selectedPegawaiId?.toString()"
                @update:model-value="(val) => (selectedPegawaiId = val ? parseInt(val as string) : null)"
                @update:open="(open) => (isSelectPegawaiOpen = open)"
                :disabled="isLoadingPegawai"
              >
                <SelectTrigger class="bg-background w-full">
                  <SelectValue placeholder="Pilih Pegawai" />
                </SelectTrigger>
                <SelectContent>
                  <!-- Search Input -->
                  <div class="mb-2 flex items-center border-b px-3 pb-2" @click.stop>
                    <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      v-model="searchPegawaiQuery"
                      placeholder="Cari pegawai..."
                      type="text"
                      class="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      @input.stop
                      @keydown.stop
                      @keypress.stop
                      @keyup.stop
                      @click.stop
                    />
                    <Button
                      v-if="searchPegawaiQuery"
                      variant="ghost"
                      size="sm"
                      class="h-auto p-1 hover:bg-transparent"
                      @click.stop="searchPegawaiQuery = ''"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                  </div>

                  <!-- Empty State -->
                  <div v-if="filteredPegawaiList.length === 0" class="flex items-center justify-center py-6">
                    <span class="text-muted-foreground text-sm">Tidak ada pegawai ditemukan</span>
                  </div>

                  <!-- Options -->
                  <SelectItem
                    v-for="pegawai in filteredPegawaiList"
                    v-else
                    :key="pegawai.id"
                    :value="pegawai.id.toString()"
                  >
                    {{ pegawai.nama }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2 md:col-span-3">
              <Label class="text-sm font-medium">Tipe Filter</Label>
              <Select v-model="filterType">
                <SelectTrigger class="bg-background w-full">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulanan">Bulanan</SelectItem>
                  <SelectItem value="range">Rentang Tanggal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <template v-if="filterType === 'bulanan'">
              <div class="space-y-2 md:col-span-3">
                <Label class="text-sm font-medium">Bulan</Label>
                <Select v-model="selectedMonth">
                  <SelectTrigger class="bg-background w-full">
                    <SelectValue placeholder="Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="m in monthOptions" :key="m.value" :value="m.value.toString()">
                      {{ m.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2 md:col-span-3">
                <Label class="text-sm font-medium">Tahun</Label>
                <Select v-model="selectedYear">
                  <SelectTrigger class="bg-background w-full">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="y in getYearOptions()" :key="y.value" :value="y.value.toString()">
                      {{ y.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </template>

            <template v-else>
              <div class="space-y-2 md:col-span-3">
                <Label class="text-sm font-medium">Dari Tanggal</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="
                        cn('w-full justify-start text-left font-normal', !startCalendarDate && 'text-muted-foreground')
                      "
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{ formatDisplayDate(startCalendarDate) }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar v-model="startCalendarDate" mode="single" initial-focus />
                  </PopoverContent>
                </Popover>
              </div>

              <div class="space-y-2 md:col-span-3">
                <Label class="text-sm font-medium">Sampai Tanggal</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="
                        cn('w-full justify-start text-left font-normal', !endCalendarDate && 'text-muted-foreground')
                      "
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{ formatDisplayDate(endCalendarDate) }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar v-model="endCalendarDate" mode="single" initial-focus />
                  </PopoverContent>
                </Popover>
              </div>
            </template>

            <div class="flex flex-wrap items-center gap-2">
              <div class="flex gap-2">
                <Button @click="fetchData" :disabled="isLoading || !selectedPegawaiId">
                  <Filter class="mr-2 h-4 w-4" /> Filter
                </Button>

                <Button
                  variant="outline"
                  @click="handleExport"
                  :disabled="isLoading || !rekapData"
                  class="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <FileText class="mr-2 h-4 w-4" /> Export Word
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        v-if="rekapData"
        :key="`rekap-${selectedPegawaiId}-${rekapData?.pegawai?.nama}`"
        class="border-blue-100 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20"
      >
        <CardContent class="p-6">
          <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
                <User class="h-6 w-6" />
              </div>
              <div>
                <p class="text-muted-foreground text-sm font-medium">Nama Pegawai</p>
                <h3 class="text-foreground text-xl font-bold">{{ pegawaiInfo?.nama || "-" }}</h3>
                <Badge variant="outline" class="mt-1 bg-white dark:bg-transparent">{{
                  pegawaiInfo?.tipePegawai || "-"
                }}</Badge>
              </div>
            </div>
            <div class="mt-2 border-t pt-4 md:mt-0 md:border-t-0 md:pt-0 md:text-right">
              <p class="text-muted-foreground text-sm font-medium">Periode Laporan</p>
              <p class="text-foreground flex items-center gap-2 text-lg font-semibold md:justify-end">
                <CalendarIcon class="h-4 w-4 text-blue-500" />
                <template v-if="periodeInfo">
                  {{ formatDate(periodeInfo.start_date) }} - {{ formatDate(periodeInfo.end_date) }}
                </template>
                <template v-else>-</template>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border shadow-sm">
        <CardHeader class="bg-muted/20 border-b pb-2">
          <CardTitle class="flex items-center gap-2 text-lg"> <Filter class="h-4 w-4" /> Detail Kehadiran </CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <div v-if="isLoading" class="space-y-3 py-12 text-center">
            <div class="border-primary mx-auto h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p class="text-muted-foreground text-sm font-medium">Sedang mengambil data rekap...</p>
          </div>

          <div v-else class="overflow-x-auto">
            <Table>
              <TableHeader class="bg-muted/30">
                <TableRow>
                  <TableHead class="w-[200px] font-bold">Tanggal</TableHead>
                  <TableHead class="font-bold">Status</TableHead>
                  <TableHead class="text-center font-bold">Jam Masuk</TableHead>
                  <TableHead class="text-center font-bold">Jam Pulang</TableHead>
                  <TableHead class="text-center font-bold">Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="detailList.length > 0">
                  <TableRow v-for="(item, idx) in detailList" :key="idx" class="hover:bg-muted/40 transition-colors">
                    <TableCell class="font-medium whitespace-nowrap">
                      {{ formatTanggalLengkap(item.tanggal) }}
                    </TableCell>
                    <TableCell>
                      <Badge :variant="getStatusColor(item.status) as any" class="rounded-sm px-2.5">
                        {{ item.status }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-center">
                      <span
                        v-if="getJamMasuk(item.data_absen) !== '-'"
                        class="rounded border border-green-100 bg-green-50 px-2 py-1 font-mono font-medium text-green-600"
                      >
                        {{ getJamMasuk(item.data_absen) }}
                      </span>
                      <span v-else class="text-muted-foreground">-</span>
                    </TableCell>
                    <TableCell class="text-center">
                      <span
                        v-if="getJamPulang(item.data_absen) !== '-'"
                        class="rounded border border-blue-100 bg-blue-50 px-2 py-1 font-mono font-medium text-blue-600"
                      >
                        {{ getJamPulang(item.data_absen) }}
                      </span>
                      <span v-else class="text-muted-foreground">-</span>
                    </TableCell>
                    <TableCell class="text-muted-foreground text-center text-sm">
                      {{
                        item.data_absen.length > 0
                          ? "-"
                          : item.status === "Tanpa Keterangan"
                            ? "Tidak Hadir (Alpha)"
                            : item.status
                      }}
                    </TableCell>
                  </TableRow>
                </template>
                <TableRow v-else>
                  <TableCell colspan="5" class="h-48 text-center">
                    <div class="text-muted-foreground flex flex-col items-center justify-center">
                      <AlertCircle class="mb-3 h-10 w-10 opacity-40" />
                      <p class="text-lg font-medium">Data tidak tersedia</p>
                      <p class="text-sm">Silakan ubah filter periode untuk melihat data lainnya.</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
