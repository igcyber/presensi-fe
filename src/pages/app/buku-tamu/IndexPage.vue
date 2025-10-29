<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import BukuTamuDialog from "@/components/dialogs/BukuTamuDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteBukuTamu, getBukuTamus } from "@/lib/api/services/bukuTamu";
import type { BukuTamu } from "@/lib/api/types/bukuTamu.types";

// Composables initialization
const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<BukuTamu>((params) => getBukuTamus(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<BukuTamu>();
const confirmDialog = useDialog<BukuTamu>();
const router = useRouter();

const { truncate } = useFormatters();

// Column definitions
const columns: Column<BukuTamu>[] = [
  {
    key: "judul",
    label: "Judul",
    sortable: true,
    searchable: true,
    width: "320px",
  },
  {
    key: "nama",
    label: "Nama Tamu",
    sortable: true,
    width: "240px",
    render: (item: BukuTamu): string => item.nama ?? "-",
  },
  {
    key: "jumlahTamu",
    label: "Jumlah Tamu",
    sortable: true,
    width: "100px",
    render: (item: BukuTamu): string => String(item.jumlahTamu ?? 0),
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "160px",
  },
];

// Event handlers
const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: BukuTamu): void => {
  router.push({ name: "app.buku-tamu.detail", params: { id: String(item.id) } });
};

const handleDelete = (item: BukuTamu): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const buku = confirmDialog.state.value.data;

    await deleteBukuTamu(buku.id);
    fetchData();

    toast.success("Berhasil menghapus buku tamu", {
      description: `"${truncate(buku.judul, 40)}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus buku tamu";
    toast.error("Gagal menghapus buku tamu", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleDialogSuccess = (): void => {
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
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Buku Tamu</h1>
          <p class="text-muted-foreground">Kelola daftar buku tamu (buat judul, lihat detail, hapus)</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <!-- Table -->
      <Card>
        <CardHeader class="px-8">
          <CardTitle>Buku Tamu</CardTitle>
          <CardDescription>List buku tamu dengan pencarian, sorting, dan paginasi</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat buku tamu'" @retry="fetchData" />

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
            :action-edit="false"
            @page-change="handlePageChange"
            @search="handleSearch"
            @row-click="handleRowClick"
            @delete="handleDelete"
          />
        </CardContent>
      </Card>

      <!-- Dialogs -->
      <BukuTamuDialog v-model:open="dialog.state.value.open" @success="handleDialogSuccess" />

      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Buku Tamu"
        :description="`Apakah Anda yakin ingin menghapus buku tamu '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
