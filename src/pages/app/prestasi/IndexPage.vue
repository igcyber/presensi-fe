<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PrestasiDialog from "@/components/dialogs/PrestasiDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deletePrestasi, getPrestasis } from "@/lib/api/services/prestasi";
import type { Prestasi } from "@/lib/api/types/prestasi.types";

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
} = useResourceList<Prestasi>((params) => getPrestasis(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Prestasi>();
const confirmDialog = useDialog<Prestasi>();
const router = useRouter();

// Column definitions
const columns: Column<Prestasi>[] = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "tahun",
    label: "Tahun",
    sortable: true,
    width: "80px",
  },
  {
    key: "tingkat",
    label: "Tingkat",
    sortable: true,
    width: "120px",
    render: (item: Prestasi): string => {
      const colors: Record<string, string> = {
        Internasional: "🌍",
        Nasional: "🇮🇩",
        Provinsi: "🏛️",
        Regional: "🏘️",
      };
      return `${colors[item.tingkat] || "🏆"} ${item.tingkat}`;
    },
  },
  {
    key: "judul",
    label: "Judul",
    sortable: true,
    width: "150px",
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Prestasi): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Prestasi): void => {
  router.push({ name: "app.prestasi.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Prestasi): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Prestasi): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const prestasi = confirmDialog.state.value.data;

    await deletePrestasi(prestasi.id);
    fetchData();

    toast.success("Berhasil menghapus prestasi", {
      description: `Prestasi "${prestasi.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus prestasi";
    toast.error("Gagal menghapus prestasi", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePrestasiDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Prestasi</h1>
          <p class="text-muted-foreground">Daftar prestasi dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Prestasi</CardTitle>
          <CardDescription>List daftar prestasi dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data prestasi'" @retry="fetchData" />

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

      <!-- Prestasi Dialog -->
      <PrestasiDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :prestasi="dialog.state.value.data"
        widthClass="sm:max-w-[800px]"
        @success="handlePrestasiDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Prestasi"
        :description="`Apakah Anda yakin ingin menghapus prestasi '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
