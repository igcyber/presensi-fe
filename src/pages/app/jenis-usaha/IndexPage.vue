<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import JenisUsahaDialog from "@/components/dialogs/JenisUsahaDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteJenisUsaha, getJenisUsahas } from "@/lib/api/services/usaha";
import type { JenisUsaha } from "@/lib/api/types/usaha.types";

// Composables
const router = useRouter();

const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<JenisUsaha>((params) => getJenisUsahas(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<JenisUsaha>();
const confirmDialog = useDialog<JenisUsaha>();

// Column definitions
const columns: Column<JenisUsaha>[] = [
  {
    key: "nama",
    label: "Jenis Usaha",
    sortable: true,
    searchable: true,
    htmlContent: true,
    render: (item: JenisUsaha): string => {
      return `
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 rounded border" style="background-color: ${item.warna}; min-width: 16px;"></div>
          <span>${item.nama}</span>
        </div>
      `;
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

const handleRowClick = (item: JenisUsaha): void => {
  router.push({ name: "app.jenis-usaha.detail", params: { id: item.id } });
};

const handleEdit = (item: JenisUsaha): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: JenisUsaha): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deleteJenisUsaha(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Jenis usaha berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus jenis usaha";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handleJenisUsahaDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Jenis Usaha</h1>
          <p class="text-muted-foreground">Daftar jenis usaha dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Jenis Usaha</CardTitle>
          <CardDescription>List daftar jenis usaha dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data jenis usaha'" @retry="fetchData" />

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

      <!-- Jenis Usaha Dialog -->
      <JenisUsahaDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :jenis-usaha="dialog.state.value.data"
        @success="handleJenisUsahaDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Jenis Usaha"
        :description="`Apakah Anda yakin ingin menghapus jenis usaha '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
