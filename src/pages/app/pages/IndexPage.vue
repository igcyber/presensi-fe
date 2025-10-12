<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PageDialog from "@/components/dialogs/PageDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deletePage, getPages } from "@/lib/api/services/page";
import type { Page } from "@/lib/api/types/page.types";
import { TIPE_OPTIONS } from "@/lib/api/types/page.types";

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
} = useResourceList<Page>((params) => getPages(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Page>();
const confirmDialog = useDialog<Page>();
const router = useRouter();

const { truncate } = useFormatters();

// Filter configuration
const filters: FilterConfig[] = [
  {
    key: "date",
    label: "Tanggal",
    type: "date",
    placeholder: "Pilih tanggal",
  },
  {
    key: "tipe",
    label: "Tipe",
    type: "select",
    options: TIPE_OPTIONS,
    placeholder: "Pilih tipe",
  },
];

// Helper function to strip HTML
const stripHtml = (html: string): string => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// Column definitions
const columns: Column<Page>[] = [
  {
    key: "nama",
    label: "Nama Page",
    sortable: true,
    searchable: true,
    width: "250px",
    render: (item: Page): string => {
      return truncate(item.nama, 50);
    },
  },
  {
    key: "tipe",
    label: "Tipe",
    sortable: true,
    width: "100px",
    render: (item: Page): string => {
      return item.tipe === "page" ? "Page" : "File";
    },
  },
  {
    key: "menu",
    label: "Menu",
    sortable: false,
    width: "180px",
    render: (item: Page): string => {
      return item.menu?.nama ? truncate(item.menu.nama, 30) : "-";
    },
  },
  {
    key: "content",
    label: "Content",
    sortable: false,
    width: "200px",
    stripHtml: true,
    render: (item: Page): string => {
      if (!item.content) return "-";
      return truncate(stripHtml(item.content), 50);
    },
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: Page): string => item.creator?.fullName || "Unknown",
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

const handleRowClick = (item: Page): void => {
  router.push({ name: "app.pages.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Page): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Page): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const page = confirmDialog.state.value.data;

    await deletePage(page.id);
    fetchData();

    toast.success("Berhasil menghapus page", {
      description: `Page "${page.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus page";
    toast.error("Gagal menghapus page", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePageDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Pages</h1>
          <p class="text-muted-foreground">
            Daftar halaman konten dengan fitur pencarian, filter, pengurutan, dan paginasi
          </p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Pages</CardTitle>
          <CardDescription>
            List daftar halaman konten dengan fitur pencarian, filter tanggal & tipe, sorting, dan pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data pages'" @retry="fetchData" />

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

      <!-- Page Dialog -->
      <PageDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :page="dialog.state.value.data"
        widthClass="sm:max-w-[900px]"
        @success="handlePageDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Page"
        :description="`Apakah Anda yakin ingin menghapus page '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
