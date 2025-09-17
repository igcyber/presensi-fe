<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PerusdaDialog from "@/components/dialogs/PerusdaDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deletePerusda, getPerusdas } from "@/lib/api/services/perusda";
import type { Perusda } from "@/lib/api/types/perusda.types";

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
} = useResourceList<Perusda>((params) => getPerusdas(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Perusda>();
const confirmDialog = useDialog<Perusda>();
const router = useRouter();

// Column definitions
const columns: Column<Perusda>[] = [
  {
    key: "nama",
    label: "Nama Perusda",
    sortable: true,
    searchable: true,
    width: "250px",
  },
  {
    key: "alamat",
    label: "Alamat",
    sortable: true,
    width: "200px",
  },
  {
    key: "telepon",
    label: "Telepon",
    sortable: false,
    width: "120px",
  },
  {
    key: "email",
    label: "Email",
    sortable: false,
    width: "180px",
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Perusda): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Perusda): void => {
  router.push({ name: "app.perusda.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Perusda): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Perusda): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const perusda = confirmDialog.state.value.data;

    await deletePerusda(perusda.id);
    fetchData();

    toast.success("Berhasil menghapus perusda", {
      description: `Perusda "${perusda.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus perusda";
    toast.error("Gagal menghapus perusda", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePerusdaDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Perusda</h1>
          <p class="text-muted-foreground">Daftar perusahaan daerah dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Perusda</CardTitle>
          <CardDescription
            >List daftar perusahaan daerah dengan fitur pencarian, sorting, dan pagination</CardDescription
          >
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data perusda'" @retry="fetchData" />

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

      <!-- Perusda Dialog -->
      <PerusdaDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :perusda="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handlePerusdaDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Perusda"
        :description="`Apakah Anda yakin ingin menghapus perusda '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
