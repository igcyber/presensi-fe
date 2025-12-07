<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import {
  CheckIcon,
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  RefreshCwIcon,
  SearchIcon,
  XIcon,
} from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";

import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { useTidakHadir, type TidakHadir } from "@/composables/useTidakHadir";

const {
  loading,
  verifying,
  tidakHadirList,
  pagination,
  tipeOptions,
  statusOptions,
  filters,
  loadTidakHadirAdmin,
  verifyPengajuan,
  setPage,
  setSearch,
  setStatusFilter,
  setTipeFilter,
  setDateFilter,
  getTipeColor,
  getStatusColor,
  formatDate,
  formatDateTime,
} = useTidakHadir();

// Dialog states
const showDetailDialog = ref(false);
const showVerifyDialog = ref(false);
const selectedItem = ref<TidakHadir | null>(null);
const verifyStatus = ref<"diterima" | "ditolak">("diterima");
const verifyKeterangan = ref("");

// Computed
const pendingCount = computed(() => {
  return tidakHadirList.value.filter((item) => item.status.toLowerCase() === "pending").length;
});

const approvedCount = computed(() => {
  return tidakHadirList.value.filter((item) => item.status.toLowerCase() === "diterima").length;
});

const declineCount = computed(() => {
  return tidakHadirList.value.filter((item) => item.status.toLowerCase() === "ditolak").length;
});

// Load data
const loadData = async () => {
  await loadTidakHadirAdmin();
};

// Event handlers
const handleVerify = (item: TidakHadir) => {
  selectedItem.value = item;
  verifyStatus.value = "diterima";
  verifyKeterangan.value = "";
  showVerifyDialog.value = true;
};

const confirmVerify = async () => {
  if (!selectedItem.value) return;

  try {
    const success = await verifyPengajuan(
      selectedItem.value.id,
      verifyStatus.value,
      verifyKeterangan.value || undefined,
    );

    if (success) {
      loadData();
      showVerifyDialog.value = false;
      selectedItem.value = null;
    }
  } catch (error: any) {
    console.error("Error verifying:", error);
  }
};

const showDetail = (item: TidakHadir) => {
  selectedItem.value = item;
  showDetailDialog.value = true;
};

const handlePageChange = (page: number) => {
  setPage(page);
  loadTidakHadirAdmin();
};

const handleSearch = useDebounceFn((searchValue: string) => {
  setSearch(searchValue);
  loadTidakHadirAdmin();
}, 300);

const handleStatusFilter = (status: any) => {
  setStatusFilter(String(status || "Semua Status"));
  loadTidakHadirAdmin();
};

const handleTipeFilter = (tipe: any) => {
  setTipeFilter(String(tipe || "Semua Tipe"));
  loadTidakHadirAdmin();
};

const handleDateFilter = (date: string) => {
  setDateFilter(date);
  loadTidakHadirAdmin();
};

const refreshData = () => {
  loadData();
};

// Mount
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Permohonan Tidak Hadir</h1>
        <p class="text-muted-foreground mt-1">Kelola dan verifikasi permohonan tidak hadir dari pegawai</p>
      </div>
      <Button variant="outline" size="sm" @click="refreshData" :disabled="loading">
        <RefreshCwIcon class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
        Refresh
      </Button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="border-l-4 border-l-blue-500">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted-foreground">Total Request</p>
              <p class="text-3xl font-bold">{{ pagination.total }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-l-4 border-l-yellow-500">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted-foreground">Pending</p>
              <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-500">{{ pendingCount }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-l-4 border-l-green-500">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted-foreground">Diterima</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-500">{{ approvedCount }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckIcon class="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-l-4 border-l-red-500">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted-foreground">Ditolak</p>
              <p class="text-3xl font-bold text-red-600 dark:text-red-500">{{ declineCount }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <XIcon class="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filters & Search -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle>Filter & Pencarian</CardTitle>
        <CardDescription class="mt-1">
          Filter dan pencarian permohonan tidak hadir
        </CardDescription>
      </CardHeader>

      <CardContent class="pt-0">
        <div class="space-y-2">
          <!-- Baris 1: Search dan Tanggal -->
          <div class="flex items-center gap-2">
            <!-- Search Bar -->
            <div class="relative flex-1">
              <SearchIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari keterangan atau verifikator..."
                :model-value="filters.search || ''"
                @input="handleSearch($event.target.value)"
                class="pl-9 h-10"
              />
            </div>

            <!-- Date Filter -->
            <div class="w-[140px] flex-shrink-0">
              <Input
                type="date"
                :model-value="filters.date"
                @input="handleDateFilter($event.target.value)"
                class="h-10 w-full"
              />
            </div>
          </div>

          <!-- Baris 2: Status dan Tipe (align kanan) -->
          <div class="flex items-center justify-end gap-2">
            <!-- Status Filter -->
            <div class="w-[140px] flex-shrink-0">
              <Select
                :model-value="filters.status || 'Semua Status'"
                @update:model-value="handleStatusFilter"
              >
                <SelectTrigger class="h-10 w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Tipe Filter -->
            <div class="w-[140px] flex-shrink-0">
              <Select
                :model-value="filters.tipe || 'Semua Tipe'"
                @update:model-value="handleTipeFilter"
              >
                <SelectTrigger class="h-10 w-full">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in tipeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Data List -->
    <Card>
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Daftar Permohonan</CardTitle>
            <CardDescription class="mt-1">
              Menampilkan {{ tidakHadirList.length }} dari {{ pagination.total }} permohonan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="border rounded-lg p-4">
            <Skeleton class="h-4 w-1/4 mb-2" />
            <Skeleton class="h-4 w-3/4 mb-2" />
            <Skeleton class="h-4 w-1/2" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!tidakHadirList.length" class="text-center py-8">
          <ClockIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada request</h3>
          <p class="text-gray-600">Belum ada request tidak hadir yang perlu diverifikasi</p>
        </div>

        <!-- Data List -->
        <div v-else class="space-y-3">
          <div
            v-for="item in tidakHadirList"
            :key="item.id"
            class="group border rounded-lg p-5 hover:shadow-md transition-all duration-200 bg-card"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <!-- Left Content -->
              <div class="flex-1 space-y-3">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-lg font-semibold">{{ item.pegawai || "Unknown" }}</h4>
                  <Badge :class="getTipeColor(item.tipe)" class="text-xs">
                    {{ item.tipe }}
                  </Badge>
                  <Badge :class="getStatusColor(item.status)" class="text-xs">
                    {{ item.status }}
                  </Badge>
                </div>

                <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div class="flex items-center gap-1.5">
                    <ClockIcon class="h-4 w-4" />
                    <span>{{ formatDate(item.tanggal_pengajuan) }}</span>
                  </div>
                  <div v-if="item.verifikator" class="flex items-center gap-1.5">
                    <span class="text-xs">•</span>
                    <span>Verifikator: {{ item.verifikator }}</span>
                    <span v-if="item.tanggal_verifikator" class="text-xs">
                      ({{ formatDateTime(item.tanggal_verifikator) }})
                    </span>
                  </div>
                </div>

                <!-- Keterangan -->
                <div class="space-y-2">
                  <div class="rounded-md bg-muted/50 p-3">
                    <p class="text-xs font-medium text-muted-foreground mb-1">Keterangan Pengajuan</p>
                    <p class="text-sm leading-relaxed">{{ item.keterangan_pengajuan }}</p>
                  </div>

                  <div v-if="item.keterangan_verifikator" class="rounded-md bg-blue-50 dark:bg-blue-950/20 p-3">
                    <p class="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                      Keterangan Verifikator
                    </p>
                    <p class="text-sm leading-relaxed text-blue-900 dark:text-blue-300">
                      {{ item.keterangan_verifikator }}
                    </p>
                  </div>

                  <div v-if="item.file_pendukung_url" class="flex items-center gap-2">
                    <FileTextIcon class="h-4 w-4 text-muted-foreground" />
                    <a
                      :href="item.file_pendukung_url"
                      target="_blank"
                      class="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Lihat File Pendukung
                    </a>
                  </div>
                </div>
              </div>

              <!-- Right Actions -->
              <div class="flex items-start gap-2 sm:flex-col sm:items-end">
                <Button variant="outline" size="sm" @click="showDetail(item)" class="w-full sm:w-auto">
                  <EyeIcon class="w-4 h-4 mr-2" />
                  Detail
                </Button>

                <Button
                  v-if="item.status.toLowerCase() === 'pending'"
                  size="sm"
                  @click="handleVerify(item)"
                  :disabled="verifying"
                  class="w-full sm:w-auto"
                >
                  <CheckIcon class="w-4 h-4 mr-2" />
                  Verifikasi
                </Button>

                <Badge v-else :class="getStatusColor(item.status)" class="text-xs">
                  {{ item.status }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
          <div class="text-sm text-muted-foreground">
            Menampilkan halaman <span class="font-medium text-foreground">{{ pagination.currentPage }}</span> dari
            <span class="font-medium text-foreground">{{ pagination.lastPage }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="pagination.currentPage <= 1"
              @click="handlePageChange(pagination.currentPage - 1)"
            >
              Sebelumnya
            </Button>
            <div class="flex items-center gap-1">
              <template v-for="page in pagination.lastPage" :key="page">
                <span
                  v-if="
                    page === 1 ||
                    page === pagination.lastPage ||
                    (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                  "
                  class="px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors min-w-[2.5rem] text-center"
                  :class="
                    page === pagination.currentPage
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'hover:bg-muted text-muted-foreground'
                  "
                  @click="handlePageChange(page)"
                >
                  {{ page }}
                </span>
                <span
                  v-else-if="
                    page === pagination.currentPage - 2 || page === pagination.currentPage + 2
                  "
                  class="px-2 text-muted-foreground"
                >
                  ...
                </span>
              </template>
            </div>
            <Button
              variant="outline"
              size="sm"
              :disabled="pagination.currentPage >= pagination.lastPage"
              @click="handlePageChange(pagination.currentPage + 1)"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Detail Dialog -->
    <Dialog v-model:open="showDetailDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Request Tidak Hadir</DialogTitle>
          <DialogDescription> Informasi lengkap request tidak hadir </DialogDescription>
        </DialogHeader>

        <div v-if="selectedItem" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Pegawai</label>
              <p class="text-sm">{{ selectedItem.pegawai || "Unknown" }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tipe</label>
              <Badge :class="getTipeColor(selectedItem.tipe)">{{ selectedItem.tipe }}</Badge>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <Badge :class="getStatusColor(selectedItem.status)">{{ selectedItem.status }}</Badge>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tanggal Pengajuan</label>
              <p class="text-sm">{{ formatDateTime(selectedItem.tanggal_pengajuan) }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Keterangan Pengajuan</label>
              <p class="text-sm bg-gray-50 p-2 rounded">{{ selectedItem.keterangan_pengajuan }}</p>
            </div>
            <div v-if="selectedItem.file_pendukung_url" class="col-span-2">
              <label class="text-sm font-medium text-gray-700">File Pendukung</label>
              <a
                :href="selectedItem.file_pendukung_url"
                target="_blank"
                class="text-sm text-blue-600 hover:underline block"
              >
                {{ selectedItem.file_pendukung }}
              </a>
            </div>
            <div v-if="selectedItem.verifikator" class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Verifikator</label>
              <p class="text-sm">{{ selectedItem.verifikator }}</p>
            </div>
            <div v-if="selectedItem.tanggal_verifikator" class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Tanggal Verifikasi</label>
              <p class="text-sm">{{ formatDateTime(selectedItem.tanggal_verifikator) }}</p>
            </div>
            <div v-if="selectedItem.keterangan_verifikator" class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Keterangan Verifikator</label>
              <p class="text-sm bg-gray-50 p-2 rounded">{{ selectedItem.keterangan_verifikator }}</p>
            </div>
          </div>

          <div v-if="selectedItem.status.toLowerCase() === 'pending'" class="flex justify-end">
            <Button @click="handleVerify(selectedItem)" :disabled="verifying">
              <CheckIcon class="w-4 h-4 mr-2" />
              Verifikasi Sekarang
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Verify Dialog -->
    <Dialog v-model:open="showVerifyDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verifikasi Permohonan</DialogTitle>
          <DialogDescription>
            Verifikasi permohonan dari {{ selectedItem?.pegawai }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <div>
            <Label for="verify-status">Status</Label>
            <Select v-model="verifyStatus">
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diterima">Diterima</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="verify-keterangan">Keterangan (Opsional)</Label>
            <Textarea
              id="verify-keterangan"
              v-model="verifyKeterangan"
              placeholder="Masukkan keterangan verifikasi..."
              :rows="4"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showVerifyDialog = false">Batal</Button>
          <Button @click="confirmVerify" :disabled="verifying">
            <CheckIcon class="w-4 h-4 mr-2" />
            {{ verifying ? "Memproses..." : "Verifikasi" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
