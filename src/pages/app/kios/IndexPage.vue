<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import KiosDialog from "@/components/dialogs/KiosDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteKios, getKioses } from "@/lib/api/services/kios";
import type { Kios } from "@/lib/api/types/kios.types";

// Composables
const router = useRouter();

const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<Kios>((params) => getKioses(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Kios>();
const confirmDialog = useDialog<Kios>();

// Column definitions
const columns: Column<Kios>[] = [
  {
    key: "jenisUsaha",
    label: "Jenis Usaha",
    sortable: false,
    width: "200px",
    htmlContent: true,
    render: (item: Kios): string => {
      if (item.jenisUsaha) {
        return `
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded border" style="background-color: ${item.jenisUsaha.warna || "#ccc"}; min-width: 16px;"></div>
            <span>${item.jenisUsaha.nama}</span>
          </div>
        `;
      }
      return "-";
    },
  },
  {
    key: "kode",
    label: "Kode",
    sortable: true,
    searchable: true,
  },
  {
    key: "pasar",
    label: "Pasar",
    sortable: false,
    width: "200px",
    render: (item: Kios): string => {
      if (item.pasar) {
        return item.pasar.nama;
      }
      return "-";
    },
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "150px",
  },
];

// Methods
const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: Kios): void => {
  router.push({ name: "app.kios.detail", params: { id: item.id } });
};

const handleEdit = (item: Kios): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Kios): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deleteKios(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Kios berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus kios";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handleKiosDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Kios</h1>
          <p class="text-muted-foreground">Daftar kios dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Kios</CardTitle>
          <CardDescription>List daftar kios dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data kios'" @retry="fetchData" />

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

      <!-- Kios Dialog -->
      <KiosDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :kios="dialog.state.value.data"
        @success="handleKiosDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Kios"
        :description="`Apakah Anda yakin ingin menghapus kios '${confirmDialog.state.value.data?.kode}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
