<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import TipePegawaiDialog from "@/components/dialogs/TipePegawaiDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteTipePegawai, getTipePegawaiList } from "@/lib/api/services/tipePegawai";
import type { TipePegawai } from "@/lib/api/types/tipePegawai.types";

const {
  items,
  isLoading,
  isError,
  error,
  pagination,
  search,
  sorts,
  fetchData,
  handleSearch,
  handlePageChange,
  addSort,
} = useResourceList<TipePegawai>((params) => getTipePegawaiList(params), { perPage: 10, enableUrlSync: true });

const dialog = useDialog<TipePegawai>();
const confirmDialog = useDialog<TipePegawai>();

const currentSortField = computed(() => (sorts.value ? sorts.value.field : ""));
const currentSortDirection = computed(() => (sorts.value ? sorts.value.direction : "asc"));

const columns: Column<TipePegawai>[] = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    searchable: true,
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "180px",
  },
  {
    key: "updatedAt",
    label: "Diperbarui",
    sortable: true,
    width: "180px",
  },
];

const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (_item: TipePegawai): void => {
  // TODO: Create detail page for tipe pegawai if needed
};

const handleEdit = (item: TipePegawai): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: TipePegawai): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deleteTipePegawai(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Tipe pegawai berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus tipe pegawai";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handleSort = (payload: { field: string; direction: "asc" | "desc" | undefined }): void => {
  addSort(payload.field, payload.direction);
};

const handleTipePegawaiDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Tipe Pegawai</h1>
          <p class="text-muted-foreground">Daftar tipe pegawai dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Tipe Pegawai</CardTitle>
          <CardDescription>List daftar tipe pegawai dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data tipe pegawai'" @retry="fetchData" />

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
            :current-page="pagination.current_page"
            :loading="isLoading"
            :search-value="search"
            :sort-field="currentSortField"
            :sort-direction="currentSortDirection"
            @page-change="handlePageChange"
            @search="handleSearch"
            @sort="handleSort"
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
            @update:search-value="(val) => (search = val)"
          />
        </CardContent>
      </Card>

      <!-- Tipe Pegawai Dialog -->
      <TipePegawaiDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :tipe-pegawai="dialog.state.value.data"
        @success="handleTipePegawaiDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Tipe Pegawai"
        :description="`Apakah Anda yakin ingin menghapus tipe pegawai '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
