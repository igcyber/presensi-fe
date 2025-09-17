<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import BupatiDialog from "@/components/dialogs/BupatiDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteBupati, getBupatis } from "@/lib/api/services/bupati";
import type { Bupati } from "@/lib/api/types/bupati.types";

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
} = useResourceList<Bupati>((params) => getBupatis(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Bupati>();
const confirmDialog = useDialog<Bupati>();
const router = useRouter();

// Column definitions
const columns: Column<Bupati>[] = [
  {
    key: "namaBupati",
    label: "Nama Bupati",
    sortable: true,
    searchable: true,
    width: "200px",
  },
  {
    key: "namaWakil",
    label: "Nama Wakil",
    sortable: true,
    searchable: true,
    width: "200px",
  },
  {
    key: "tahunAwal",
    label: "Periode",
    sortable: true,
    width: "120px",
    render: (item: Bupati): string => `${item.tahunAwal} - ${item.tahunAkhir}`,
  },
  {
    key: "status",
    label: "Status",
    sortable: false,
    width: "100px",
    render: (item: Bupati): string => {
      const currentYear = new Date().getFullYear();
      const status = item.tahunAkhir >= currentYear ? "👑 Aktif" : "📋 Selesai";
      return status;
    },
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Bupati): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Bupati): void => {
  router.push({ name: "app.bupati.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Bupati): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Bupati): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const bupati = confirmDialog.state.value.data;

    await deleteBupati(bupati.id);
    fetchData();

    toast.success("Berhasil menghapus data bupati", {
      description: `Data "${bupati.namaBupati}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus data bupati";
    toast.error("Gagal menghapus data bupati", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleBupatiDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Bupati</h1>
          <p class="text-muted-foreground">
            Daftar bupati dan wakil bupati dengan fitur pencarian, pengurutan, dan paginasi
          </p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Bupati</CardTitle>
          <CardDescription
            >List daftar bupati dan wakil bupati dengan fitur pencarian, sorting, dan pagination</CardDescription
          >
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data bupati'" @retry="fetchData" />

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

      <!-- Bupati Dialog -->
      <BupatiDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :bupati="dialog.state.value.data"
        widthClass="sm:max-w-[600px]"
        @success="handleBupatiDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Data Bupati"
        :description="`Apakah Anda yakin ingin menghapus data bupati '${confirmDialog.state.value.data?.namaBupati}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
