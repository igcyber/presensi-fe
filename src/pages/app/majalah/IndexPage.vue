<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import MajalahDialog from "@/components/dialogs/MajalahDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteMajalah, getMajalahs } from "@/lib/api/services/majalah";
import type { Majalah } from "@/lib/api/types/majalah.types";
import { MONTH_OPTIONS } from "@/lib/api/types/majalah.types";
import { generateYearOptions } from "@/lib/utils/helper";

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
} = useResourceList<Majalah>((params) => getMajalahs(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Majalah>();
const confirmDialog = useDialog<Majalah>();
const router = useRouter();

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    key: "bulan",
    label: "Bulan",
    type: "select",
    placeholder: "Pilih bulan",
    options: [...MONTH_OPTIONS.map((option) => ({ ...option, value: String(option.value) }))],
  },
  {
    key: "tahun",
    label: "Tahun",
    type: "select",
    placeholder: "Pilih tahun",
    options: [...generateYearOptions(2020).map((option) => ({ ...option, value: String(option.value) }))],
  },
];

// Column definitions
const columns: Column<Majalah>[] = [
  {
    key: "bulan",
    label: "Bulan",
    sortable: true,
    width: "150px",
    render: (item: Majalah): string => {
      const month = MONTH_OPTIONS.find((m) => m.value === item.bulan);
      return month?.label || "Unknown";
    },
  },
  {
    key: "tahun",
    label: "Tahun",
    sortable: true,
    width: "100px",
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: true,
    width: "150px",
    render: (item: Majalah): string => item.creator.fullName,
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

const handleRowClick = (item: Majalah): void => {
  router.push({ name: "app.majalah.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Majalah): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Majalah): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const majalah = confirmDialog.state.value.data;

    await deleteMajalah(majalah.id);
    fetchData();

    const monthName = MONTH_OPTIONS.find((m) => m.value === majalah.bulan)?.label || "Unknown";
    toast.success("Berhasil menghapus majalah", {
      description: `Majalah ${monthName} ${majalah.tahun} telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus majalah";
    toast.error("Gagal menghapus majalah", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleMajalahDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Majalah</h1>
          <p class="text-muted-foreground">Daftar majalah dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Majalah</CardTitle>
          <CardDescription>List daftar majalah dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data majalah'" @retry="fetchData" />

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

      <!-- Majalah Dialog -->
      <MajalahDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :majalah="dialog.state.value.data"
        widthClass="sm:max-w-[600px]"
        @success="handleMajalahDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Majalah"
        :description="`Apakah Anda yakin ingin menghapus majalah ini? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
