<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PedagangDialog from "@/components/dialogs/PedagangDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deletePedagang, getPedagangs } from "@/lib/api/services/pedagang";
import type { Pedagang } from "@/lib/api/types/pedagang.types";

// Composables
const router = useRouter();

const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<Pedagang>((params) => getPedagangs(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Pedagang>();
const confirmDialog = useDialog<Pedagang>();

const { date } = useFormatters();

// Column definitions
const columns: Column<Pedagang>[] = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    searchable: true,
  },
  {
    key: "nik",
    label: "NIK",
    sortable: true,
    width: "150px",
    searchable: true,
  },
  {
    key: "noKk",
    label: "No. KK",
    sortable: true,
    width: "150px",
  },
  {
    key: "tempatLahir",
    label: "Tempat Lahir",
    sortable: true,
    width: "150px",
  },
  {
    key: "tanggalLahir",
    label: "Tanggal Lahir",
    sortable: true,
    width: "150px",
    render: (item: Pedagang): string => {
      return item.tanggalLahir ? date(item.tanggalLahir) : "-";
    },
  },
  {
    key: "alamat",
    label: "Alamat",
    sortable: false,
    searchable: true,
  },
  // {
  //   key: "createdAt",
  //   label: "Dibuat",
  //   sortable: true,
  //   width: "150px",
  // },
];

// Methods
const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: Pedagang): void => {
  router.push({ name: "app.pedagang.detail", params: { id: item.id } });
};

const handleEdit = (item: Pedagang): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Pedagang): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deletePedagang(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Pedagang berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus pedagang";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handlePedagangDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Pedagang</h1>
          <p class="text-muted-foreground">Daftar pedagang dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Pedagang</CardTitle>
          <CardDescription>List daftar pedagang dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data pedagang'" @retry="fetchData" />

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

      <!-- Pedagang Dialog -->
      <PedagangDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :pedagang="dialog.state.value.data"
        @success="handlePedagangDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Pedagang"
        :description="`Apakah Anda yakin ingin menghapus pedagang '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
