<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import StrukturDialog from "@/components/dialogs/StrukturDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteStruktur, getStrukturs } from "@/lib/api/services/struktur";
import type { Struktur } from "@/lib/api/types/struktur.types";

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
} = useResourceList<Struktur>((params) => getStrukturs(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Struktur>();
const confirmDialog = useDialog<Struktur>();
const router = useRouter();

const { truncate } = useFormatters();

// Filter configuration untuk date filter
const filters: FilterConfig[] = [
  {
    key: "date",
    label: "Tanggal",
    type: "date",
    placeholder: "Pilih tanggal",
  },
];

// Column definitions
const columns: Column<Struktur>[] = [
  {
    key: "nama",
    label: "Nama Struktur",
    sortable: true,
    searchable: true,
    width: "250px",
    render: (item: Struktur): string => {
      return truncate(item.nama, 50);
    },
  },
  {
    key: "tentang",
    label: "Tentang",
    sortable: false,
    width: "200px",
    render: (item: Struktur): string => {
      return truncate(item.tentang, 50);
    },
  },
  {
    key: "parent",
    label: "Parent",
    sortable: false,
    width: "150px",
    render: (item: Struktur): string => {
      return item.parent?.nama || "-";
    },
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Struktur): string => item.creator?.fullName || "Unknown",
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

const handleRowClick = (item: Struktur): void => {
  router.push({ name: "app.struktur.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Struktur): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Struktur): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const struktur = confirmDialog.state.value.data;

    await deleteStruktur(struktur.id);
    fetchData();

    toast.success("Berhasil menghapus struktur", {
      description: `Struktur "${struktur.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus struktur";
    toast.error("Gagal menghapus struktur", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleStrukturDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Struktur</h1>
          <p class="text-muted-foreground">
            Daftar struktur organisasi DPRD dengan fitur pencarian, pengurutan, dan paginasi
          </p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Struktur</CardTitle>
          <CardDescription>
            List daftar struktur organisasi DPRD dengan fitur pencarian, filter tanggal, sorting, dan pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data struktur'" @retry="fetchData" />

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
            :filters="filters"
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

      <!-- Struktur Dialog -->
      <StrukturDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :struktur="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleStrukturDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Struktur"
        :description="`Apakah Anda yakin ingin menghapus struktur '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
