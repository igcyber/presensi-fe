<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import VideoDialog from "@/components/dialogs/VideoDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteVideo, getVideos } from "@/lib/api/services/video";
import type { Video } from "@/lib/api/types/video.types";

// Composables
const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<Video>((params) => getVideos(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Video>();
const confirmDialog = useDialog<Video>();

const { truncate } = useFormatters();

// Router
const router = useRouter();

// Column definitions
const columns: Column<Video>[] = [
  {
    key: "judul",
    label: "Judul",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "isi",
    label: "Deskripsi",
    sortable: false,
    width: "250px",
    render: (item: Video): string => {
      return truncate(item.isi, 100);
    },
  },
  {
    key: "link",
    label: "Sumber",
    sortable: false,
    width: "120px",
    render: (item: Video): string => {
      if (item.link.includes("youtu")) {
        return "YouTube";
      } else if (item.link.includes("facebook")) {
        return "Facebook";
      }
      return "Lainnya";
    },
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

const handleRowClick = (item: Video): void => {
  // Navigasi ke detail
  router.push({ name: "app.video.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Video): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Video): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const video = confirmDialog.state.value.data;

    await deleteVideo(video.id);
    fetchData();

    toast.success("Berhasil menghapus video", {
      description: `Video "${video.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus video";
    toast.error("Gagal menghapus video", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleVideoDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Video</h1>
          <p class="text-muted-foreground">Daftar video dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Video</CardTitle>
          <CardDescription>List daftar video dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data video'" @retry="fetchData" />

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

      <!-- Video Dialog -->
      <VideoDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :video="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleVideoDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Video"
        :description="`Apakah Anda yakin ingin menghapus video '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
