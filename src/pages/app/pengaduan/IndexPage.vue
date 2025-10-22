<script setup lang="ts">
import { Download, Eye, Settings } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import PengaduanActionForm from "@/components/features/pengaduan/PengaduanActionForm.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { exportPengaduanExcel, getPengaduans } from "@/lib/api/services/pengaduan";
import type { Pengaduan } from "@/lib/api/types/pengaduan.types";

// Composables initialization
const {
  items,
  isLoading,
  isError,
  error,
  pagination,
  query,
  fetchData,
  handleSearch,
  handlePageChange,
  handleCustomFilter,
  reset,
} = useResourceList<Pengaduan>((params) => getPengaduans(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Pengaduan>();
const router = useRouter();

// State
const isExporting = ref(false);

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    placeholder: "Pilih status",
    options: [
      { label: "Belum", value: "belum" },
      { label: "Diterima", value: "diterima" },
    ],
  },
  {
    key: "kategori",
    label: "Kategori",
    type: "select",
    placeholder: "Pilih kategori",
    options: [], // Will be populated from API
  },
  {
    key: "tanggal_mulai",
    label: "Tanggal Mulai",
    type: "date",
    placeholder: "Pilih tanggal mulai",
  },
  {
    key: "tanggal_akhir",
    label: "Tanggal Akhir",
    type: "date",
    placeholder: "Pilih tanggal akhir",
  },
];

// Column definitions
const columns: Column<Pengaduan>[] = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    searchable: true,
    width: "200px",
  },
  {
    key: "nik",
    label: "NIK",
    sortable: false,
    searchable: true,
    width: "150px",
  },
  {
    key: "aduan",
    label: "Aduan",
    sortable: true,
    searchable: true,
    width: "250px",
    render: (item: Pengaduan): string => item.aduan.length > 50 ? item.aduan.substring(0, 50) + "..." : item.aduan,
  },
  {
    key: "kategoriAduan",
    label: "Kategori",
    sortable: false,
    width: "150px",
    render: (item: Pengaduan): string => item.kategoriAduan || "-",
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: "120px",
    render: (item: Pengaduan): string => {
      const status = item.status;
      return status === 'diterima' ? 'Diterima' : 'Belum';
    },
  },
  {
    key: "createdAt",
    label: "Tanggal",
    sortable: true,
    width: "150px",
  },
];

// Event handlers
const handleRowClick = (item: Pengaduan): void => {
  router.push({ name: "app.pengaduan.detail", params: { id: item.id.toString() } });
};

const handleUpdateStatus = (item: Pengaduan): void => {
  dialog.openView(item);
};

const handleUpdateKategori = (item: Pengaduan): void => {
  dialog.openView(item);
};

const handleExportExcel = async (): Promise<void> => {
  try {
    isExporting.value = true;
    const blob = await exportPengaduanExcel(query.value);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data Pengaduan ${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Export berhasil", {
      description: "File Excel telah berhasil diunduh",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal export data";
    toast.error("Gagal export data", { description: errorMessage });
  } finally {
    isExporting.value = false;
  }
};

const handleActionSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Watchers
watch(
  query,
  () => {
    fetchData();
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Pengaduan Masyarakat</h1>
          <p class="text-muted-foreground">Kelola pengaduan masyarakat dengan fitur pencarian, filter, dan aksi</p>
        </div>
        <div class="flex gap-2">
          <Button
            @click="handleExportExcel"
            :disabled="isExporting"
            variant="outline"
            class="flex items-center gap-2"
          >
            <Download v-if="!isExporting" class="h-4 w-4" />
            <div v-else class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            {{ isExporting ? "Exporting..." : "Export Excel" }}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Daftar Pengaduan</CardTitle>
          <CardDescription>Kelola pengaduan masyarakat dengan fitur pencarian, filter, dan aksi</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data pengaduan'" @retry="fetchData" />

          <!-- Data Table -->
          <DataTable
            v-else
            :data="items"
            :columns="columns"
            :searchable="true"
            :pagination="true"
            :page-size="pagination.per_page"
            :total-data="pagination.total"
            :total-pages="pagination.last_page"
            :loading="isLoading"
            :filters="filterConfig"
            @page-change="handlePageChange"
            @search="handleSearch"
            @custom-filter="handleCustomFilter"
            @row-click="handleRowClick"
            @edit="handleUpdateStatus"
            @delete="handleUpdateKategori"
            @reset-filter="reset"
          />
        </CardContent>
      </Card>

      <!-- Action Form Dialog -->
      <div v-if="dialog.state.value.open && dialog.state.value.data">
        <PengaduanActionForm
          :pengaduan="dialog.state.value.data"
          :action-type="'status'"
          @success="handleActionSuccess"
          @cancel="dialog.closeDialog"
        />
      </div>
    </div>
  </div>
</template>
