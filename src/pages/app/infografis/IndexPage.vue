<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import InfografisDialog from "@/components/dialogs/InfografisDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteInfografis, getInfografis } from "@/lib/api/services/infografis";
import type { Infografis } from "@/lib/api/types/infografis.types";

// Composables initialization
const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<Infografis>((params) => getInfografis(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Infografis>();
const confirmDialog = useDialog<Infografis>();
const router = useRouter();

const { truncate } = useFormatters();

// Column definitions
const columns: Column<Infografis>[] = [
  {
    key: "nama",
    label: "Nama Infografis",
    sortable: true,
    searchable: true,
    width: "250px",
  },
  {
    key: "foto",
    label: "Preview",
    sortable: false,
    width: "150px",
    previewable: true,
    previewUrl: (item: Infografis): string => {
      return item.fileUrl || item.foto_url;
    },
    previewName: (item: Infografis): string => {
      return item.nama;
    },
    render: (_item: Infografis): string => {
      return "Gambar";
    },
  },
  {
    key: "url",
    label: "URL",
    sortable: false,
    width: "200px",
    render: (item: Infografis): string => {
      const url = item.url || "";
      return url ? truncate(url, 30) : "-";
    },
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: "100px",
    render: (item: Infografis): string => {
      return item.status === "1" ? "Aktif" : "Tidak Aktif";
    },
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Infografis): string => item.createdByUser?.fullName || "Unknown",
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

const handleRowClick = (item: Infografis): void => {
  router.push({ name: "app.infografis.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Infografis): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Infografis): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const infografis = confirmDialog.state.value.data;

    await deleteInfografis(infografis.id);
    fetchData();

    toast.success("Berhasil menghapus infografis", {
      description: `Infografis "${infografis.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus infografis";
    toast.error("Gagal menghapus infografis", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleInfografisDialogSuccess = (): void => {
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
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </CardContent>
      </Card>

      <!-- Infografis Dialog -->
      <InfografisDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :infografis="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleInfografisDialogSuccess"
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
