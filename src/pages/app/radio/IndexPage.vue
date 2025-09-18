<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import RadioDialog from "@/components/dialogs/RadioDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteRadio, getRadios } from "@/lib/api/services/radio";
import type { Radio } from "@/lib/api/types/radio.types";

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
} = useResourceList<Radio>((params) => getRadios(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Radio>();
const confirmDialog = useDialog<Radio>();
const router = useRouter();

const { truncate } = useFormatters();

// Column definitions
const columns: Column<Radio>[] = [
  {
    key: "judul",
    label: "Judul",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "link",
    label: "Link",
    sortable: false,
    width: "250px",
    render: (item: Radio): string => {
      const url = item.link || "";
      return truncate(url, 40);
    },
  },
  {
    key: "isi",
    label: "Deskripsi",
    sortable: false,
    width: "200px",
    render: (item: Radio): string => {
      const isi = item.isi || "";
      return truncate(isi, 30);
    },
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Radio): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Radio): void => {
  router.push({ name: "app.radio.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Radio): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Radio): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const radio = confirmDialog.state.value.data;

    await deleteRadio(radio.id);
    fetchData();

    toast.success("Berhasil menghapus radio", {
      description: `Radio "${radio.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus radio";
    toast.error("Gagal menghapus radio", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleRadioDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Radio</h1>
          <p class="text-muted-foreground">Daftar radio streaming dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Radio</CardTitle>
          <CardDescription>List daftar radio streaming dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data radio'" @retry="fetchData" />

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

      <!-- Radio Dialog -->
      <RadioDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :radio="dialog.state.value.data"
        widthClass="sm:max-w-[600px]"
        @success="handleRadioDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Radio"
        :description="`Apakah Anda yakin ingin menghapus radio '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
