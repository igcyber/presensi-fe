<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import DokumenDialog from "@/components/dialogs/DokumenDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteDokumen, getDokumens } from "@/lib/api/services/dokumen";
import type { Dokumen } from "@/lib/api/types/dokumen.types";

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
} = useResourceList<Dokumen>((params) => getDokumens(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Dokumen>();
const confirmDialog = useDialog<Dokumen>();
const router = useRouter();

const { truncate } = useFormatters();

// Column definitions
const columns: Column<Dokumen>[] = [
  {
    key: "nama",
    label: "Nama ",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "isi",
    label: "Deskripsi",
    width: "250px",
    render: (item: Dokumen): string => truncate(item.isi, 100),
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: true,
    width: "150px",
    render: (item: Dokumen): string => item.createdByUser.fullName,
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

const handleRowClick = (item: Dokumen): void => {
  router.push({ name: "app.dokumen.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Dokumen): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Dokumen): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const dokumen = confirmDialog.state.value.data;

    await deleteDokumen(dokumen.id);
    fetchData();

    toast.success("Berhasil menghapus dokumen", {
      description: `Dokumen "${dokumen.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus dokumen";
    toast.error("Gagal menghapus dokumen", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleDokumenDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Dokumen</h1>
          <p class="text-muted-foreground">Daftar dokumen dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Dokumen</CardTitle>
          <CardDescription>List daftar dokumen dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data dokumen'" @retry="fetchData" />

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

      <!-- Dokumen Dialog -->
      <DokumenDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :dokumen="dialog.state.value.data"
        widthClass="sm:max-w-[600px]"
        @success="handleDokumenDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Dokumen"
        :description="`Apakah Anda yakin ingin menghapus dokumen '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
