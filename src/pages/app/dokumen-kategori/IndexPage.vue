<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import KategoriDokumenDialog from "@/components/dialogs/KategoriDokumenDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteKategoriDokumen, getKategoriDokumens } from "@/lib/api/services/kategoriDokumen";
import type { KategoriDokumen } from "@/lib/api/types/kategoriDokumen.types";

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
} = useResourceList<KategoriDokumen>((params) => getKategoriDokumens(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<KategoriDokumen>();
const confirmDialog = useDialog<KategoriDokumen>();

// Column definitions
const columns: Column<KategoriDokumen>[] = [
  {
    key: "nama",
    label: "Nama ",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: true,
    width: "150px",
    render: (item: KategoriDokumen): string => item.createdByUser.fullName,
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

const handleRowClick = (item: KategoriDokumen): void => {
  // KategoriDokumen tidak memiliki detail page, bisa diarahkan ke edit atau tidak ada action
  dialog.openEdit(item);
};

const handleEdit = (item: KategoriDokumen): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: KategoriDokumen): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const kategori = confirmDialog.state.value.data;

    await deleteKategoriDokumen(kategori.id);
    fetchData();

    toast.success("Berhasil menghapus kategori JDIH", {
      description: `Kategori JDIH "${kategori.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus kategori JDIH";
    toast.error("Gagal menghapus kategori JDIH", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleKategoriDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Kategori JDIH</h1>
          <p class="text-muted-foreground">Daftar kategori JDIH dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <div class="flex gap-2 self-start sm:self-auto">
          <Button @click="openCreateDialog" class="flex items-center gap-2">
            <PlusIcon class="h-4 w-4" />
            Tambah Baru
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Kategori JDIH</CardTitle>
          <CardDescription>List daftar kategori JDIH dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState
            v-if="isError"
            :message="error?.message || 'Gagal memuat data kategori JDIH'"
            @retry="fetchData"
          />

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

      <!-- Kategori Dokumen Dialog -->
      <KategoriDokumenDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :kategoriDokumen="dialog.state.value.data"
        widthClass="sm:max-w-[600px]"
        @success="handleKategoriDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Kategori JDIH"
        :description="`Apakah Anda yakin ingin menghapus kategori JDIH '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
