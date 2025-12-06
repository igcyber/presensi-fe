<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import KantorDialog from "@/components/dialogs/KantorDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteKantor, getKantor } from "@/lib/api/services/kantor";
import type { Kantor } from "@/lib/api/types/kantor.types";

const {
  items,
  isLoading,
  isError,
  error,
  pagination,
  search,
  sorts,
  fetchData,
  handleSearch,
  handlePageChange,
  addSort,
} = useResourceList<Kantor>((params) => getKantor(params), { perPage: 10, enableUrlSync: true });

const dialog = useDialog<Kantor>();
const confirmDialog = useDialog<Kantor>();

const currentSortField = computed(() => (sorts.value ? sorts.value.field : ""));
const currentSortDirection = computed(() => (sorts.value ? sorts.value.direction : "asc"));

const columns: Column<Kantor>[] = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    searchable: true,
  },
  {
    key: "alamat",
    label: "Alamat",
    sortable: false,
    searchable: true,
  },
  {
    key: "radius_limit",
    label: "Radius (m)",
    sortable: true,
    width: "120px",
  },
  {
    key: "jam_masuk",
    label: "Jam Masuk",
    sortable: true,
    width: "120px",
  },
  {
    key: "jam_pulang",
    label: "Jam Pulang",
    sortable: true,
    width: "120px",
  },
  {
    key: "jumlah_pegawai",
    label: "Jumlah Pegawai",
    sortable: true,
    width: "140px",
  },
];

const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (_item: Kantor): void => {
  // TODO: Create detail page for kantor if needed
};

const handleEdit = (item: Kantor): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Kantor): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deleteKantor(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Kantor berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus kantor";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handleSort = (payload: { field: string; direction: "asc" | "desc" | undefined }): void => {
  addSort(payload.field, payload.direction);
};

const handleKantorDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Kantor</h1>
          <p class="text-muted-foreground">Daftar kantor dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Kantor</CardTitle>
          <CardDescription>List daftar kantor dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data kantor'" @retry="fetchData" />

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
            :current-page="pagination.current_page"
            :loading="isLoading"
            :search-value="search"
            :sort-field="currentSortField"
            :sort-direction="currentSortDirection"
            @page-change="handlePageChange"
            @search="handleSearch"
            @sort="handleSort"
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
            @update:search-value="(val) => (search = val)"
          />
        </CardContent>
      </Card>

      <!-- Kantor Dialog -->
      <KantorDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :kantor="dialog.state.value.data"
        @success="handleKantorDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Kantor"
        :description="`Apakah Anda yakin ingin menghapus kantor '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
