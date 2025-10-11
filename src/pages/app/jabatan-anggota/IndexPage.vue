<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import JabatanAnggotaDialog from "@/components/dialogs/JabatanAnggotaDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deleteJabatanAnggota, getJabatanAnggotas } from "@/lib/api/services/jabatanAnggota";
import { getStrukturs } from "@/lib/api/services/struktur";
import type { JabatanAnggota } from "@/lib/api/types/jabatanAnggota.types";
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
} = useResourceList<JabatanAnggota>((params) => getJabatanAnggotas(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<JabatanAnggota>();
const confirmDialog = useDialog<JabatanAnggota>();
const router = useRouter();

const { truncate } = useFormatters();

// State untuk struktur options
const strukturList = ref<Struktur[]>([]);
const loadingStrukturs = ref(false);

// Filter configuration dengan dynamic struktur options
const filters = ref<FilterConfig[]>([
  {
    key: "date",
    label: "Tanggal",
    type: "date",
    placeholder: "Pilih tanggal",
  },
  {
    key: "struktur_id",
    label: "Struktur",
    type: "select",
    options: [],
    placeholder: "Pilih struktur",
  },
]);

// Load strukturs untuk filter options
const loadStrukturs = async () => {
  try {
    loadingStrukturs.value = true;
    const response = await getStrukturs({ limit: 100 });
    strukturList.value = response.data.data;

    // Update filter options
    const strukturFilter = filters.value.find((f) => f.key === "struktur_id");
    if (strukturFilter) {
      strukturFilter.options = strukturList.value.map((s) => ({
        label: s.nama,
        value: s.id,
      }));
    }
  } catch (error) {
    console.error("Failed to load strukturs:", error);
  } finally {
    loadingStrukturs.value = false;
  }
};

// Column definitions
const columns: Column<JabatanAnggota>[] = [
  {
    key: "foto",
    label: "Foto",
    sortable: false,
    width: "80px",
    previewable: true,
    previewUrl: (item: JabatanAnggota) => item.fotoUrl,
    previewName: (item: JabatanAnggota) => item.nama,
    render: (_item: JabatanAnggota): string => {
      return "Preview"; // Untuk fallback text
    },
  },
  {
    key: "nama",
    label: "Nama Anggota",
    sortable: true,
    searchable: true,
    width: "200px",
    render: (item: JabatanAnggota): string => {
      return truncate(item.nama, 40);
    },
  },
  {
    key: "jabatan",
    label: "Jabatan",
    sortable: true,
    width: "200px",
    render: (item: JabatanAnggota): string => {
      return truncate(item.jabatan, 40);
    },
  },
  {
    key: "struktur",
    label: "Struktur",
    sortable: false,
    width: "180px",
    render: (item: JabatanAnggota): string => {
      return item.struktur?.nama ? truncate(item.struktur.nama, 30) : "-";
    },
  },
  {
    key: "anggota",
    label: "Parent Anggota",
    sortable: false,
    width: "150px",
    render: (item: JabatanAnggota): string => {
      return item.anggota?.nama ? truncate(item.anggota.nama, 25) : "-";
    },
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: JabatanAnggota): string => item.creator?.fullName || "Unknown",
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

const handleRowClick = (item: JabatanAnggota): void => {
  router.push({ name: "app.jabatan-anggota.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: JabatanAnggota): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: JabatanAnggota): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const jabatanAnggota = confirmDialog.state.value.data;

    await deleteJabatanAnggota(jabatanAnggota.id);
    fetchData();

    toast.success("Berhasil menghapus jabatan anggota", {
      description: `Jabatan anggota "${jabatanAnggota.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus jabatan anggota";
    toast.error("Gagal menghapus jabatan anggota", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleJabatanAnggotaDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  loadStrukturs();
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
          <h1 class="text-3xl font-bold tracking-tight">Jabatan Anggota</h1>
          <p class="text-muted-foreground">
            Daftar jabatan anggota DPRD dengan fitur pencarian, filter, pengurutan, dan paginasi
          </p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Jabatan Anggota</CardTitle>
          <CardDescription>
            List daftar jabatan anggota DPRD dengan fitur pencarian, filter tanggal & struktur, sorting, dan pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState
            v-if="isError"
            :message="error?.message || 'Gagal memuat data jabatan anggota'"
            @retry="fetchData"
          />

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
          >
          </DataTable>
        </CardContent>
      </Card>

      <!-- JabatanAnggota Dialog -->
      <JabatanAnggotaDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :jabatan-anggota="dialog.state.value.data"
        widthClass="sm:max-w-[700px]"
        @success="handleJabatanAnggotaDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Jabatan Anggota"
        :description="`Apakah Anda yakin ingin menghapus jabatan anggota '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
