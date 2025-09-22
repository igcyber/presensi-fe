<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import KontenDialog from "@/components/dialogs/KontenDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteKonten, getKontens } from "@/lib/api/services/konten";
import type { Konten } from "@/lib/api/types/konten.types";

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
} = useResourceList<Konten>((params) => getKontens(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Konten>();
const confirmDialog = useDialog<Konten>();
const router = useRouter();

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    key: "date",
    label: "Tanggal",
    type: "date",
    placeholder: "Pilih tanggal",
  },
];

// Column definitions
const columns: Column<Konten>[] = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "slug",
    label: "Slug",
    sortable: true,
    width: "200px",
    render: (item: Konten): string => item.slug,
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Konten): string => item.creator?.fullName || "Unknown",
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

const handleRowClick = (item: Konten): void => {
  router.push({ name: "app.konten.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Konten): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Konten): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const konten = confirmDialog.state.value.data;

    await deleteKonten(konten.id);
    fetchData();

    toast.success("Berhasil menghapus konten", {
      description: `Konten "${konten.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus konten";
    toast.error("Gagal menghapus konten", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleKontenDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Konten</h1>
          <p class="text-muted-foreground">Daftar konten halaman dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Konten</CardTitle>
          <CardDescription>List daftar konten halaman dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data konten'" @retry="fetchData" />

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

      <!-- Konten Dialog -->
      <KontenDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :konten="dialog.state.value.data"
        widthClass="sm:max-w-[1000px]"
        @success="handleKontenDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Konten"
        :description="`Apakah Anda yakin ingin menghapus konten '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
