<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import LayananDialog from "@/components/dialogs/LayananDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteLayanan, getLayanans } from "@/lib/api/services/layanan";
import type { Layanan } from "@/lib/api/types/layanan.types";

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
} = useResourceList<Layanan>((params) => getLayanans(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Layanan>();
const confirmDialog = useDialog<Layanan>();
const router = useRouter();

// Column definitions
const columns: Column<Layanan>[] = [
  {
    key: "nama",
    label: "Nama Layanan",
    sortable: true,
    searchable: true,
    width: "250px",
  },
  {
    key: "jenis",
    label: "Jenis",
    sortable: true,
    width: "150px",
  },
  {
    key: "opd",
    label: "OPD",
    sortable: true,
    width: "200px",
    render: (item: Layanan): string => item.opd.nama,
  },
  {
    key: "alamat",
    label: "Alamat",
    sortable: false,
    width: "200px",
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Layanan): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Layanan): void => {
  router.push({ name: "app.layanan.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Layanan): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Layanan): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const layanan = confirmDialog.state.value.data;

    await deleteLayanan(layanan.id);
    fetchData();

    toast.success("Berhasil menghapus layanan", {
      description: `Layanan "${layanan.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus layanan";
    toast.error("Gagal menghapus layanan", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleLayananDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Layanan</h1>
          <p class="text-muted-foreground">Daftar layanan publik dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Layanan</CardTitle>
          <CardDescription>List daftar layanan publik dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data layanan'" @retry="fetchData" />

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

      <!-- Layanan Dialog -->
      <LayananDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :layanan="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleLayananDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Layanan"
        :description="`Apakah Anda yakin ingin menghapus layanan '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
