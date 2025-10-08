<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import FotoDialog from "@/components/dialogs/FotoDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteFoto, getFotos } from "@/lib/api/services/foto";
import type { Foto } from "@/lib/api/types/foto.types";

// Composables
const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<Foto>((params) => getFotos(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Foto>();
const confirmDialog = useDialog<Foto>();

// Router
const router = useRouter();

// Column definitions
const columns: Column<Foto>[] = [
  {
    key: "judul",
    label: "Judul",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "foto",
    label: "Preview",
    sortable: false,
    width: "150px",
    previewable: true,
    previewUrl: (item: Foto): string => {
      return item.fotoUrl || item.foto_url;
    },
    previewName: (item: Foto): string => {
      return item.judul;
    },
    render: (_item: Foto): string => {
      return "Gambar";
    },
  },
  {
    key: "createdByUser",
    label: "Dibuat Oleh",
    sortable: false,
    width: "150px",
    render: (item: Foto): string => {
      return item.createdByUser.fullName;
    },
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

const handleRowClick = (item: Foto): void => {
  // Navigasi ke detail
  router.push({ name: "app.foto.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Foto): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Foto): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const foto = confirmDialog.state.value.data;

    await deleteFoto(foto.id);
    fetchData();

    toast.success("Berhasil menghapus foto", {
      description: `Foto "${foto.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus foto";
    toast.error("Gagal menghapus foto", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleFotoDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Foto</h1>
          <p class="text-muted-foreground">Daftar foto dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Foto</CardTitle>
          <CardDescription>List daftar foto dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data foto'" @retry="fetchData" />

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
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </CardContent>
      </Card>

      <!-- Foto Dialog -->
      <FotoDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :foto="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleFotoDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Foto"
        :description="`Apakah Anda yakin ingin menghapus foto '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
