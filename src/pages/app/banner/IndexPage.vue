<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BannerDialog from "@/components/dialogs/BannerDialog.vue";
import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteBanner, getBanners } from "@/lib/api/services/banner";
import type { Banner } from "@/lib/api/types/banner.types";

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
} = useResourceList<Banner>((params) => getBanners(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Banner>();
const confirmDialog = useDialog<Banner>();
const router = useRouter();

const { truncate } = useFormatters();

// Column definitions
const columns: Column<Banner>[] = [
  {
    key: "nama",
    label: "Nama Infografis",
    sortable: true,
    searchable: true,
    width: "200px",
  },
  {
    key: "url",
    label: "URL",
    sortable: false,
    width: "200px",
    render: (item: Banner): string => {
      const url = item.url || "";
      return url ? truncate(url, 30) : "-";
    },
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: "100px",
    render: (item: Banner): string => {
      return item.status === "1" ? "Aktif" : "Tidak Aktif";
    },
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Banner): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Banner): void => {
  router.push({ name: "app.infografis.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Banner): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Banner): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const banner = confirmDialog.state.value.data;

    await deleteBanner(banner.id);
    fetchData();

    toast.success("Berhasil menghapus infografis", {
      description: `Infografis "${banner.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus infografis";
    toast.error("Gagal menghapus infografis", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleBannerDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Infografis</h1>
          <p class="text-muted-foreground">Daftar infografis dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Infografis</CardTitle>
          <CardDescription>List daftar infografis dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data infografis'" @retry="fetchData" />

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

      <!-- Banner Dialog -->
      <BannerDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :banner="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleBannerDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Infografis"
        :description="`Apakah Anda yakin ingin menghapus infografis '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
