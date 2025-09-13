<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import BeritaDialog from "@/components/dialogs/BeritaDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteBerita, getBeritas } from "@/lib/api/services/berita";
import { getOpds } from "@/lib/api/services/opd";
import type { Berita } from "@/lib/api/types/berita.types";
import type { Opd } from "@/lib/api/types/opd.types";

// Composables
const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<Berita>((params) => getBeritas(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Berita>();
const confirmDialog = useDialog<Berita>();

// Reactive state
const opdOptions = ref<{ label: string; value: number }[]>([]);

// Column definitions
const columns: Column<Berita>[] = [
  {
    key: "judul",
    label: "Judul",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "opd",
    label: "OPD",
    sortable: true,
    width: "200px",
    render: (item: Berita): string => {
      return item.opd.nama;
    },
  },
  {
    key: "tag",
    label: "Tag",
    sortable: true,
    width: "150px",
    render: (item: Berita): string => {
      return item.tag
        .split(",")
        .map((tag) => tag.trim())
        .join(", ");
    },
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: true,
    width: "150px",
    render: (item: Berita): string => {
      return item.creator.fullName;
    },
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "150px",
  },
];

// Methods
const loadOpdOptions = async (): Promise<void> => {
  try {
    const opds = await getOpds();
    opdOptions.value = opds.data.data.map((opd: Opd) => ({ label: opd.nama, value: opd.id }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data OPD";
    toast.error("Gagal", { description: errorMessage });
  }
};

const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (_item: Berita): void => {};

const handleEdit = (item: Berita): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Berita): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deleteBerita(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Berita berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus berita";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handleBeritaDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  loadOpdOptions();
});

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
          <h1 class="text-3xl font-bold tracking-tight">Berita</h1>
          <p class="text-muted-foreground">Daftar berita dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Berita</CardTitle>
          <CardDescription>List of berita dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data berita'" @retry="fetchData" />

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

      <!-- Berita Dialog -->
      <BeritaDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :berita="dialog.state.value.data"
        :opd-options="opdOptions"
        widthClass="sm:max-w-[1000px]"
        @success="handleBeritaDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Berita"
        :description="`Apakah Anda yakin ingin menghapus berita '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
