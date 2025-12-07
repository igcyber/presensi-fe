<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Download,
  FileText,
  Filter,
  Info,
  Loader2,
  Plus,
  Search,
} from "lucide-vue-next";
import moment from "moment";
import { onMounted, reactive, ref } from "vue";
import { toast } from "vue-sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useFormatters } from "@/composables/useFormatters";
import { checkPermohonanStatus, createPermohonan, getPermohonanList } from "@/lib/api/services/presensi";
import type { PermohonanItem, TipePermohonan } from "@/lib/api/types/presensi.types";
import { cn } from "@/lib/utils";

const { date: formatDate } = useFormatters();

// --- State Data ---
const isLoading = ref(false);
const isSubmitting = ref(false);
const permohonanList = ref<PermohonanItem[]>([]);
const meta = ref({ total: 0, currentPage: 1, lastPage: 1 });
const activePermohonan = ref<PermohonanItem | null>(null);

// --- State Filter ---
const filters = reactive({
  search: "",
  tipe: "Semua Tipe",
});

// --- State Form Dialog ---
const isDialogOpen = ref(false);
const formData = reactive({
  tipe: "" as TipePermohonan | "",
  keterangan: "",
  tanggal: undefined as CalendarDate | undefined,
  file: null as File | null,
});
const fileInputRef = ref<HTMLInputElement | null>(null);

// --- Methods: Fetch Data ---
const fetchData = async (page = 1) => {
  try {
    isLoading.value = true;
    const params: any = { page, per_page: 10 };

    if (filters.search) params.search = filters.search;
    if (filters.tipe !== "Semua Tipe") params.tipe = filters.tipe;

    const response = await getPermohonanList(params);
    permohonanList.value = response.data.data;
    meta.value = {
      total: response.data.meta.total,
      currentPage: response.data.meta.currentPage,
      lastPage: response.data.meta.lastPage,
    };
  } catch (error: any) {
    console.error(error);
    toast.error("Gagal memuat data permohonan.");
  } finally {
    isLoading.value = false;
  }
};

const checkStatus = async () => {
  try {
    const response = await checkPermohonanStatus();
    activePermohonan.value = response.data;
  } catch (error) {
    console.error("Gagal mengecek status permohonan", error);
  }
};

// --- Methods: Create ---
const resetForm = () => {
  formData.tipe = "";
  formData.keterangan = "";
  formData.tanggal = undefined;
  formData.file = null;
  if (fileInputRef.value) fileInputRef.value.value = "";
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diperbolehkan");
      target.value = "";
      return;
    }
    formData.file = file;
  }
};

const handleSubmit = async () => {
  if (!formData.tipe) return toast.error("Pilih tipe izin");
  if (!formData.tanggal) return toast.error("Pilih tanggal");
  if (!formData.keterangan) return toast.error("Isi keterangan");
  if (!formData.file) return toast.error("Upload file pendukung (PDF)");

  try {
    isSubmitting.value = true;
    const dateStr = formData.tanggal.toString();

    await createPermohonan({
      tipe: formData.tipe as TipePermohonan,
      tanggal_pengajuan: dateStr,
      keterangan_pengajuan: formData.keterangan,
      file_pendukung: formData.file,
    });

    toast.success("Permohonan berhasil dikirim");
    isDialogOpen.value = false;
    resetForm();
    fetchData();
    checkStatus();
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Gagal mengirim permohonan.";
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};

// --- Helper UI ---
const getBadgeVariant = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "diterima":
      return "default";
    case "ditolak":
      return "destructive";
    case "batal":
      return "secondary";
    case "pending":
    default:
      return "outline";
  }
};

const formatStatusLabel = (status: string) => {
  if (!status) return "Pending";
  // Kapitalisasi huruf awal: 'diterima' -> 'Diterima'
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getBadgeClass = (status: string) => {
  const s = status?.toLowerCase();

  // Status: Diterima (Hijau)
  if (s === "diterima") {
    return "bg-green-600 hover:bg-green-700 border-transparent text-white";
  }

  // Status: Pending (Kuning)
  if (s === "pending") {
    return "text-yellow-600 border-yellow-600 bg-yellow-50 hover:bg-yellow-100";
  }

  // Sisa status (ditolak/batal)
  return "";
};

const formatDisplayDate = (dateVal: CalendarDate | undefined) => {
  if (!dateVal) return "Pilih Tanggal";
  const jsDate = new Date(dateVal.year, dateVal.month - 1, dateVal.day);
  return moment(jsDate).format("DD MMMM YYYY");
};

onMounted(() => {
  fetchData();
  checkStatus();
});
</script>

<template>
  <div class="bg-background min-h-[80vh] p-4 md:p-6 lg:p-8">
    <div class="space-y-6">
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Pengajuan Izin</h1>
          <p class="text-muted-foreground">Kelola permohonan izin, sakit, atau cuti Anda.</p>
        </div>

        <div class="flex flex-col items-end gap-1">
          <Button @click="isDialogOpen = true" class="shadow-sm" :disabled="!!activePermohonan">
            <Plus class="mr-2 h-4 w-4" /> Ajukan Baru
          </Button>
          <p v-if="activePermohonan" class="text-xs font-medium text-amber-600">
            Anda memiliki pengajuan aktif tanggal {{ formatDate(activePermohonan.tanggalPengajuan) }}
          </p>
        </div>
      </div>

      <Card class="border shadow-sm">
        <CardContent class="p-6">
          <div class="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
            <div class="space-y-2 md:col-span-5">
              <Label class="text-sm font-medium">Pencarian</Label>
              <div class="relative">
                <Search class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  v-model="filters.search"
                  placeholder="Cari keterangan..."
                  class="bg-background pl-9"
                  @keyup.enter="fetchData(1)"
                />
              </div>
            </div>

            <div class="space-y-2 md:col-span-4">
              <Label class="text-sm font-medium">Tipe Izin</Label>
              <Select v-model="filters.tipe">
                <SelectTrigger class="bg-background w-full">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua Tipe">Semua Tipe</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Izin">Izin</SelectItem>
                  <SelectItem value="Cuti">Cuti</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="md:col-span-3">
              <Button
                @click="fetchData(1)"
                class="bg-primary hover:bg-primary/90 w-full shadow-sm"
                :disabled="isLoading"
              >
                <Filter class="mr-2 h-4 w-4" />
                {{ isLoading ? "Memuat..." : "Terapkan Filter" }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border shadow-sm">
        <CardHeader class="bg-muted/20 border-b pb-2">
          <CardTitle class="flex items-center gap-2 text-lg">
            <FileText class="h-4 w-4" /> Riwayat Pengajuan
          </CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader class="bg-muted/30">
                <TableRow>
                  <TableHead class="font-bold">Tanggal Pengajuan</TableHead>
                  <TableHead class="font-bold">Tipe</TableHead>
                  <TableHead class="font-bold">Keterangan</TableHead>
                  <TableHead class="font-bold">File</TableHead>
                  <TableHead class="font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="isLoading">
                  <TableRow>
                    <TableCell colspan="5" class="h-24 text-center">
                      <div class="text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 class="h-4 w-4 animate-spin" /> Memuat data...
                      </div>
                    </TableCell>
                  </TableRow>
                </template>

                <template v-else-if="permohonanList.length > 0">
                  <TableRow v-for="item in permohonanList" :key="item.id" class="hover:bg-muted/40 transition-colors">
                    <TableCell class="font-medium whitespace-nowrap">
                      {{ formatDate(item.tanggalPengajuan) }}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" class="bg-background">{{ item.tipe }}</Badge>
                    </TableCell>
                    <TableCell class="max-w-xs truncate" :title="item.keteranganPengajuan">
                      {{ item.keteranganPengajuan }}
                    </TableCell>
                    <TableCell>
                      <a
                        v-if="item.filePendukungUrl"
                        :href="item.filePendukungUrl"
                        target="_blank"
                        class="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <Download class="h-3 w-3" /> Unduh PDF
                      </a>
                      <span v-else class="text-muted-foreground text-sm">-</span>
                    </TableCell>

                    <TableCell>
                      <div class="flex items-center gap-2">
                        <Badge
                          :variant="getBadgeVariant(item.status) as any"
                          :class="cn('rounded-sm px-2.5 font-normal capitalize', getBadgeClass(item.status))"
                        >
                          {{ formatStatusLabel(item.status) }}
                        </Badge>

                        <TooltipProvider v-if="item.status === 'ditolak' && item.keteranganVerifikator">
                          <Tooltip>
                            <TooltipTrigger>
                              <Info class="text-destructive h-4 w-4 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p class="mb-1 font-medium">Alasan Penolakan:</p>
                              <p class="text-xs">{{ item.keteranganVerifikator }}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>

                <TableRow v-else>
                  <TableCell colspan="5" class="h-32 text-center">
                    <div class="text-muted-foreground flex flex-col items-center justify-center">
                      <AlertCircle class="mb-2 h-8 w-8 opacity-30" />
                      <p class="font-medium">Belum ada riwayat pengajuan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div v-if="meta.total > 0" class="flex justify-end gap-2">
        <Button variant="outline" size="sm" :disabled="meta.currentPage === 1" @click="fetchData(meta.currentPage - 1)">
          Previous
        </Button>
        <span class="text-muted-foreground flex items-center px-2 text-sm">
          Page {{ meta.currentPage }} of {{ meta.lastPage }}
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="meta.currentPage === meta.lastPage"
          @click="fetchData(meta.currentPage + 1)"
        >
          Next
        </Button>
      </div>
    </div>

    <Dialog :open="isDialogOpen" @update:open="(val) => !val && (isDialogOpen = false)">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Pengajuan Baru</DialogTitle>
          <DialogDescription> Isi formulir di bawah untuk mengajukan izin tidak hadir. </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label>Tipe Izin</Label>
            <Select v-model="formData.tipe">
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sakit">Sakit</SelectItem>
                <SelectItem value="Izin">Izin</SelectItem>
                <SelectItem value="Cuti">Cuti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label>Tanggal</Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="cn('justify-start text-left font-normal', !formData.tanggal && 'text-muted-foreground')"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ formatDisplayDate(formData.tanggal) }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar v-model="formData.tanggal" mode="single" initial-focus />
              </PopoverContent>
            </Popover>
          </div>

          <div class="grid gap-2">
            <Label>Keterangan</Label>
            <Textarea v-model="formData.keterangan" placeholder="Jelaskan alasan pengajuan..." />
          </div>

          <div class="grid gap-2">
            <Label>File Pendukung (PDF)</Label>
            <Input ref="fileInputRef" type="file" accept=".pdf" @change="handleFileChange" />
            <p class="text-muted-foreground text-xs">Wajib format .pdf</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" @click="isDialogOpen = false" :disabled="isSubmitting">Batal</Button>
          <Button @click="handleSubmit" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? "Mengirim..." : "Kirim Pengajuan" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
