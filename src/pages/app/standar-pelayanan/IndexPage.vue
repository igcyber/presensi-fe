<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import StandarPelayananDialog from "@/components/dialogs/StandarPelayananDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteStandarPelayanan, getStandarPelayanans } from "@/lib/api/services/standarPelayanan";
import type { StandarPelayanan } from "@/lib/api/types/standarPelayanan.types";

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
} = useResourceList<StandarPelayanan>((params) => getStandarPelayanans(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<StandarPelayanan>();
const confirmDialog = useDialog<StandarPelayanan>();
const router = useRouter();

const { truncate } = useFormatters();

// Column definitions
const columns: Column<StandarPelayanan>[] = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "deskripsi",
    label: "Deskripsi",
    width: "200px",
    render: (item: StandarPelayanan): string => truncate(item.deskripsi, 100),
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: true,
    width: "150px",
    render: (item: StandarPelayanan): string => item.creator?.fullName || "Unknown",
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

const handleRowClick = (item: StandarPelayanan): void => {
  router.push({ name: "app.standar-pelayanan.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: StandarPelayanan): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: StandarPelayanan): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const standarPelayanan = confirmDialog.state.value.data;

    await deleteStandarPelayanan(standarPelayanan.id);
    fetchData();

    toast.success("Berhasil menghapus standar pelayanan", {
      description: `Standar pelayanan "${standarPelayanan.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus standar pelayanan";
    toast.error("Gagal menghapus standar pelayanan", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleStandarPelayananDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Standar Pelayanan</h1>
          <p class="text-muted-foreground">Daftar standar pelayanan dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Standar Pelayanan</CardTitle>
          <CardDescription
            >List daftar standar pelayanan dengan fitur pencarian, sorting, dan pagination</CardDescription
          >
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState
            v-if="isError"
            :message="error?.message || 'Gagal memuat data standar pelayanan'"
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

      <!-- Standar Pelayanan Dialog -->
      <StandarPelayananDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode === 'view' ? 'edit' : dialog.state.value.mode"
        :standar-pelayanan="dialog.state.value.data"
        widthClass="sm:max-w-[600px]"
        @success="handleStandarPelayananDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Standar Pelayanan"
        :description="`Apakah Anda yakin ingin menghapus standar pelayanan '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
