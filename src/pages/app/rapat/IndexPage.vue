<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import RapatDialog from "@/components/dialogs/RapatDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteRapat, getRapats } from "@/lib/api/services/rapat";
import type { Rapat } from "@/lib/api/types/rapat.types";

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
} = useResourceList<Rapat>((params) => getRapats(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Rapat>();
const confirmDialog = useDialog<Rapat>();
const router = useRouter();

const { truncate, date, time } = useFormatters();

// Column definitions
const columns: Column<Rapat>[] = [
  {
    key: "judul",
    label: "Judul Rapat",
    sortable: true,
    searchable: true,
    width: "300px",
    render: (item: Rapat): string => {
      return truncate(item.judul, 50);
    },
  },
  {
    key: "lokasi",
    label: "Lokasi",
    sortable: true,
    width: "200px",
    render: (item: Rapat): string => {
      return item.lokasi ? truncate(item.lokasi, 30) : "-";
    },
  },
  {
    key: "tanggal",
    label: "Tanggal",
    sortable: true,
    width: "150px",
    render: (item: Rapat): string => {
      return item.tanggal ? date(item.tanggal) : "-";
    },
  },
  {
    key: "waktu",
    label: "Waktu",
    sortable: false,
    width: "150px",
    render: (item: Rapat): string => {
      if (!item.waktuMulai && !item.waktuBerakhir) return "-";
      const mulai = item.waktuMulai ? time(item.waktuMulai) : "-";
      const berakhir = item.waktuBerakhir ? time(item.waktuBerakhir) : "-";
      return `${mulai} - ${berakhir}`;
    },
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Rapat): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Rapat): void => {
  router.push({ name: "app.rapat.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Rapat): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Rapat): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const rapat = confirmDialog.state.value.data;

    await deleteRapat(rapat.id);
    fetchData();

    toast.success("Berhasil menghapus rapat", {
      description: `Rapat "${rapat.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus rapat";
    toast.error("Gagal menghapus rapat", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleRapatDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Rapat</h1>
          <p class="text-muted-foreground">Daftar rapat DPRD dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Rapat</CardTitle>
          <CardDescription>List daftar rapat DPRD dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data rapat'" @retry="fetchData" />

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
            @page-change="handlePageChange"
            @search="handleSearch"
            @custom-filter="handleCustomFilter"
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </CardContent>
      </Card>

      <!-- Rapat Dialog -->
      <RapatDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :rapat="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleRapatDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Rapat"
        :description="`Apakah Anda yakin ingin menghapus rapat '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
