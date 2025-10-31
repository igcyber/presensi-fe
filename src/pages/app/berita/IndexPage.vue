<script setup lang="ts">
import { PlusIcon, Play } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import BeritaDialog from "@/components/dialogs/BeritaDialog.vue";
import ScrapingDialog from "@/components/dialogs/ScrapingDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteBerita, getBeritas } from "@/lib/api/services/berita";
import type { Berita } from "@/lib/api/types/berita.types";

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
} = useResourceList<Berita>((params) => getBeritas(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Berita>();
const confirmDialog = useDialog<Berita>();
const router = useRouter();
const scrapingOpen = ref(false);

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    key: "date",
    label: "Tanggal",
    type: "date",
    placeholder: "Pilih tanggal",
  },
];

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
    key: "tag",
    label: "Tag",
    sortable: false,
    width: "150px",
    render: (item: Berita): string => item.tagRelation?.namaTag || "-",
  },
  // {
  //   key: "views",
  //   label: "Dilihat",
  //   sortable: true,
  //   width: "150px",
  //   render: (item: Berita): string => item.views.toString(),
  // },
  {
    key: "creator",
    label: "Pembuat",
    sortable: true,
    width: "150px",
    render: (item: Berita): string => item.creator.fullName,
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

const handleRowClick = (item: Berita): void => {
  router.push({ name: "app.berita.detail", params: { id: item.id.toString() } });
};

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
    const berita = confirmDialog.state.value.data;

    await deleteBerita(berita.id);
    fetchData();

    toast.success("Berhasil menghapus berita", {
      description: `Berita "${berita.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus berita";
    toast.error("Gagal menghapus berita", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleBeritaDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Berita</h1>
          <p class="text-muted-foreground">Daftar berita dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="secondary" @click="() => (scrapingOpen = true)" class="flex items-center gap-2">
            <Play class="h-4 w-4" />
            Tarik Berita
          </Button>
          <Button @click="openCreateDialog" class="flex items-center gap-2">
            <PlusIcon class="h-4 w-4" />
            Tambah Baru
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Berita</CardTitle>
          <CardDescription>List daftar berita dengan fitur pencarian, sorting, dan pagination</CardDescription>
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
            :filters="filterConfig"
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

      <!-- Berita Dialog -->
      <BeritaDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :berita="dialog.state.value.data"
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

      <!-- Scraping Dialog -->
      <ScrapingDialog v-model:open="scrapingOpen" widthClass="sm:max-w-[1000px]" @success="fetchData" />
    </div>
  </div>
</template>
