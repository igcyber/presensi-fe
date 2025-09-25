<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import AplikasiTerkaitDialog from "@/components/dialogs/AplikasiTerkaitDialog.vue";
import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteAplikasiTerkait, getAplikasiTerkait } from "@/lib/api/services/aplikasiTerkait";
import type { AplikasiTerkait } from "@/lib/api/types/aplikasiTerkait.types";

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
} = useResourceList<AplikasiTerkait>((params) => getAplikasiTerkait(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<AplikasiTerkait>();
const confirmDialog = useDialog<AplikasiTerkait>();
const router = useRouter();

const { truncate } = useFormatters();

// Column definitions
const columns: Column<AplikasiTerkait>[] = [
  {
    key: "text",
    label: "Nama Aplikasi",
    sortable: true,
    searchable: true,
    width: "200px",
  },
  {
    key: "link",
    label: "Link",
    sortable: false,
    width: "250px",
    render: (item: AplikasiTerkait): string => {
      return truncate(item.link, 40);
    },
  },
  {
    key: "cover",
    label: "Cover",
    sortable: false,
    width: "150px",
    render: (item: AplikasiTerkait): string => {
      return item.cover ? "Ada" : "Tidak ada";
    },
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: AplikasiTerkait): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: AplikasiTerkait): void => {
  router.push({ name: "app.aplikasi-terkait.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: AplikasiTerkait): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: AplikasiTerkait): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const aplikasiTerkait = confirmDialog.state.value.data;

    await deleteAplikasiTerkait(aplikasiTerkait.id);
    fetchData();

    toast.success("Berhasil menghapus aplikasi terkait", {
      description: `Aplikasi terkait "${aplikasiTerkait.text}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus aplikasi terkait";
    toast.error("Gagal menghapus aplikasi terkait", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleAplikasiTerkaitDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Aplikasi Terkait</h1>
          <p class="text-muted-foreground">Daftar aplikasi terkait dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Aplikasi Terkait</CardTitle>
          <CardDescription
            >List daftar aplikasi terkait dengan fitur pencarian, sorting, dan pagination</CardDescription
          >
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState
            v-if="isError"
            :message="error?.message || 'Gagal memuat data aplikasi terkait'"
            @retry="fetchData"
          />

          <!-- Data Table -->
          <DataTable
            v-else
            :data="items"
            :columns="columns"
            :searchable="false"
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

      <!-- Aplikasi Terkait Dialog -->
      <AplikasiTerkaitDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :aplikasi-terkait="dialog.state.value.data"
        widthClass="sm:max-w-[500px]"
        @success="handleAplikasiTerkaitDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Aplikasi Terkait"
        :description="`Apakah Anda yakin ingin menghapus aplikasi terkait '${confirmDialog.state.value.data?.text}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
