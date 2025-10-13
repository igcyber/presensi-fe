<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import TagDialog from "@/components/dialogs/TagDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteTag, getTags } from "@/lib/api/services/tag";
import type { Tag } from "@/lib/api/types/tag.types";

// Composables initialization
const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange, reset } =
  useResourceList<Tag>((params) => getTags(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Tag>();
const confirmDialog = useDialog<Tag>();
const router = useRouter();

// Column definitions
const columns: Column<Tag>[] = [
  {
    key: "namaTag",
    label: "Nama Tag",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: false,
    width: "200px",
    render: (item: Tag): string => item.creator?.fullName || "Unknown",
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

const handleRowClick = (item: Tag): void => {
  router.push({ name: "app.tags.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Tag): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Tag): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const tag = confirmDialog.state.value.data;

    await deleteTag(tag.id);
    fetchData();

    toast.success("Berhasil menghapus tag", {
      description: `Tag "${tag.namaTag}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus tag";
    toast.error("Gagal menghapus tag", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleTagDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Tags</h1>
          <p class="text-muted-foreground">Daftar tag berita dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Tags</CardTitle>
          <CardDescription> List daftar tag berita dengan fitur pencarian, sorting, dan pagination </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data tags'" @retry="fetchData" />

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
            @reset-filter="reset"
          />
        </CardContent>
      </Card>

      <!-- Tag Dialog -->
      <TagDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :tag="dialog.state.value.data"
        @success="handleTagDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Tag"
        :description="`Apakah Anda yakin ingin menghapus tag '${confirmDialog.state.value.data?.namaTag}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
