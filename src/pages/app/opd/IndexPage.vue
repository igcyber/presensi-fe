<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import OpdDialog from "@/components/dialogs/OpdDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteOpd, getOpds } from "@/lib/api/services/opd";
import type { Opd } from "@/lib/api/types/opd.types";

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
} = useResourceList<Opd>((params) => getOpds(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Opd>();
const confirmDialog = useDialog<Opd>();
const router = useRouter();

// Column definitions
const columns: Column<Opd>[] = [
  {
    key: "nama",
    label: "Nama OPD",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "alamat",
    label: "Alamat",
    sortable: true,
    width: "250px",
    render: (item: Opd): string => {
      const alamat = item.alamat || "";
      return alamat.length > 50 ? `${alamat.substring(0, 50)}...` : alamat;
    },
  },
  {
    key: "website",
    label: "Website",
    sortable: false,
    width: "200px",
    render: (item: Opd): string => {
      if (!item.website) return "-";
      const url = item.website.replace(/^https?:\/\//, "");
      return url.length > 30 ? `${url.substring(0, 30)}...` : url;
    },
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Opd): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Opd): void => {
  router.push({ name: "app.opd.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Opd): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Opd): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const opd = confirmDialog.state.value.data;

    await deleteOpd(opd.id);
    fetchData();

    toast.success("Berhasil menghapus OPD", {
      description: `OPD "${opd.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus OPD";
    toast.error("Gagal menghapus OPD", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleOpdDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">OPD</h1>
          <p class="text-muted-foreground">
            Daftar Organisasi Perangkat Daerah dengan fitur pencarian, pengurutan, dan paginasi
          </p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>OPD</CardTitle>
          <CardDescription
            >List daftar Organisasi Perangkat Daerah dengan fitur pencarian, sorting, dan pagination</CardDescription
          >
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data OPD'" @retry="fetchData" />

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

      <!-- OPD Dialog -->
      <OpdDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :opd="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleOpdDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus OPD"
        :description="`Apakah Anda yakin ingin menghapus OPD '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
