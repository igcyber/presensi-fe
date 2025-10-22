<script setup lang="ts">
import { Plus, Settings } from "lucide-vue-next";
import { ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import KategoriDokumenDialog from "@/components/dialogs/KategoriDokumenDialog.vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteKategoriDokumen, getKategoriDokumens } from "@/lib/api/services/kategoriDokumen";
import type { KategoriDokumen } from "@/lib/api/types/kategoriDokumen.types";

// Props
interface Props {
  open: boolean;
}

// Emits
interface Emits {
  (e: "update:open", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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
} = useResourceList<KategoriDokumen>((params) => getKategoriDokumens(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<KategoriDokumen>();
const confirmDialog = useDialog<KategoriDokumen>();

// Column definitions
const columns: Column<KategoriDokumen>[] = [
  {
    key: "nama",
    label: "Nama Kategori",
    sortable: true,
    searchable: true,
    width: "300px",
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: true,
    width: "200px",
    render: (item: KategoriDokumen): string => item.createdByUser.fullName,
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

const handleEdit = (item: KategoriDokumen): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: KategoriDokumen): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const kategori = confirmDialog.state.value.data;

    await deleteKategoriDokumen(kategori.id);
    fetchData();

    toast.success("Berhasil menghapus kategori", {
      description: `Kategori "${kategori.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus kategori";
    toast.error("Gagal menghapus kategori", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleKategoriDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
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
  <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
    <DialogContent class="max-h-[80vh] w-[90vw] max-w-[1200px] p-0">
      <DialogHeader class="p-6 pb-4">
        <div class="flex items-center justify-between">
          <div>
            <DialogTitle>Kelola Kategori Dokumen</DialogTitle>
            <DialogDescription>Manajemen kategori dokumen dengan fitur CRUD lengkap</DialogDescription>
          </div>
          <Button @click="openCreateDialog" class="flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>
      </DialogHeader>

      <div class="px-6 pb-6">
        <!-- Error State -->
        <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data kategori'" @retry="fetchData" />

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
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </DialogContent>
  </Dialog>

  <!-- Kategori Dialog -->
  <KategoriDokumenDialog
    v-model:open="dialog.state.value.open"
    :mode="dialog.state.value.mode"
    :kategori-dokumen="dialog.state.value.data"
    widthClass="sm:max-w-[500px]"
    @success="handleKategoriDialogSuccess"
  />

  <!-- Confirm Delete Dialog -->
  <BaseConfirmDialog
    v-model:open="confirmDialog.state.value.open"
    title="Hapus Kategori"
    :description="`Apakah Anda yakin ingin menghapus kategori '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
    confirm-text="Hapus"
    variant="destructive"
    :loading="confirmDialog.state.value.loading"
    @confirm="confirmDelete"
  />
</template>
