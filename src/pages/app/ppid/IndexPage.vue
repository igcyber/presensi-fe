<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PPIDDialog from "@/components/dialogs/PPIDDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deletePPID, getPPIDs } from "@/lib/api/services/ppid";
import type { PPID, PPIDType } from "@/lib/api/types/ppid.types";

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
} = useResourceList<PPID>((params) => getPPIDs(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<PPID>();
const confirmDialog = useDialog<PPID>();
const router = useRouter();

const { truncate } = useFormatters();

const filterConfig: FilterConfig[] = [
  {
    key: "kategori",
    label: "Kategori",
    type: "select",
    placeholder: "Pilih kategori",
    options: [
      { label: "Informasi Berkala", value: "Informasi Berkala" },
      { label: "Informasi Setiap Saat", value: "Informasi Setiap Saat" },
      { label: "Informasi Serta Merta", value: "Informasi Serta Merta" },
      { label: "Informasi Dikecualikan", value: "Informasi Dikecualikan" },
    ],
  },
];

// Column definitions
const columns: Column<PPID>[] = [
  {
    key: "judul",
    label: "Judul",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "keterangan",
    label: "Keterangan",
    width: "250px",
    // stripHtml: true,
    htmlContent: true,
    render: (item: PPID): string => truncate(item.keterangan, 100),
  },
  {
    key: "kategori",
    label: "Kategori",
    sortable: true,
    width: "150px",
  },
  {
    key: "subKategori",
    label: "Sub Kategori",
    sortable: true,
    width: "150px",
  },
  {
    key: "tahun",
    label: "Tahun",
    sortable: true,
    width: "100px",
  },
  {
    key: "jenisFile",
    label: "Jenis File",
    width: "120px",
    render: (item: PPID): string =>
      item.jenisFile ? item.jenisFile.charAt(0).toUpperCase() + item.jenisFile.slice(1) : "",
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: true,
    width: "150px",
    render: (item: PPID): string => item.createdByUser.fullName,
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "150px",
  },
];

// Event handlers
const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: PPID): void => {
  router.push({
    name: "app.ppid.detail",
    params: { id: item.id.toString(), type: item.kategori.toLowerCase().split(" ").join("") as PPIDType },
  });
};

const handleEdit = (item: PPID): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: PPID): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const ppid = confirmDialog.state.value.data;

    const ppidType = ppid.kategori.toLowerCase().split(" ").join("") as PPIDType;

    await deletePPID(ppid.id, ppidType as PPIDType);
    fetchData();

    toast.success("Berhasil menghapus PPID", {
      description: `PPID "${ppid.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus PPID";
    toast.error("Gagal menghapus PPID", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePPIDDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">PPID</h1>
          <p class="text-muted-foreground">Daftar PPID dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>PPID</CardTitle>
          <CardDescription>List daftar PPID dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data PPID'" @retry="fetchData" />

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
            @edit="handleEdit"
            @delete="handleDelete"
            @reset-filter="reset"
          />
        </CardContent>
      </Card>

      <!-- PPID Dialog -->
      <PPIDDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :ppid="dialog.state.value.data"
        widthClass="sm:max-w-[800px]"
        @success="handlePPIDDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus PPID"
        :description="`Apakah Anda yakin ingin menghapus PPID '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
