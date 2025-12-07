<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PegawaiDialog from "@/components/dialogs/PegawaiDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { getKantor } from "@/lib/api/services/kantor";
import { deletePegawai, getPegawai } from "@/lib/api/services/pegawai";
import { getTipePegawai } from "@/lib/api/services/tipePegawai";
import type { Kantor } from "@/lib/api/types/kantor.types";
import type { Pegawai } from "@/lib/api/types/pegawai.types";
import type { TipePegawai } from "@/lib/api/types/tipePegawai.types";

const router = useRouter();

// Get resource list with URL sync (includes pagination state)
const {
  items,
  isLoading,
  isError,
  error,
  pagination,
  search,
  sorts,
  fetchData,
  handleSearch,
  handlePageChange,
  addSort,
  addFilter,
  removeFilter,
  clearFilters,
} = useResourceList<Pegawai>((params) => getPegawai(params), { perPage: 10, enableUrlSync: true });

const dialog = useDialog<Pegawai>();
const confirmDialog = useDialog<Pegawai>();

// Reactive state
const tipePegawaiList = ref<{ label: string; value: string; id: number }[]>([]);
const kantorOptions = ref<{ label: string; value: number }[]>([]);
const filterValues = ref<Record<string, any>>({});

// Options untuk dialog (menggunakan ID sebagai value)
const tipePegawaiOptions = computed(() =>
  tipePegawaiList.value.map((item) => ({
    label: item.label,
    value: item.id,
  })),
);

// Options untuk filter datatable (menggunakan nama sebagai value)
const tipePegawaiFilterOptions = computed(() =>
  tipePegawaiList.value.map((item) => ({
    label: item.label,
    value: item.value,
  })),
);

// Computed for DataTable props
const currentSortField = computed(() => (sorts.value ? sorts.value.field : ""));
const currentSortDirection = computed(() => (sorts.value ? sorts.value.direction : "asc"));

// Filter config for DataTable - menggunakan type dengan nilai text
const filterConfigs = computed<FilterConfig[]>(() => [
  {
    key: "type",
    label: "Tipe Pegawai",
    type: "select",
    options: tipePegawaiFilterOptions.value,
    placeholder: "Pilih tipe pegawai",
  },
]);

// Column definitions
const columns: Column<Pegawai>[] = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    searchable: true,
  },
  {
    key: "tipePegawaiId",
    label: "Tipe Pegawai",
    sortable: true,
    width: "150px",
    render: (item: Pegawai): string => {
      return getTipePegawaiNama(item.tipePegawaiId);
    },
  },
  {
    key: "kantorId",
    label: "Kantor",
    sortable: true,
    width: "200px",
    render: (item: Pegawai): string => {
      return getKantorNama(item.kantorId);
    },
  },
  {
    key: "checkRadius",
    label: "Check Radius",
    sortable: true,
    width: "150px",
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "150px",
  },
];

// Methods
const loadTipePegawaiOptions = async (): Promise<void> => {
  try {
    const response = await getTipePegawai();
    tipePegawaiList.value = response.data.map((item: TipePegawai) => ({
      label: item.nama,
      value: item.nama, // Gunakan nama sebagai value untuk filter datatable
      id: item.id, // ID untuk dialog
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data tipe pegawai";
    toast.error("Gagal", { description: errorMessage });
  }
};

const loadKantorOptions = async (): Promise<void> => {
  try {
    const response = await getKantor();
    kantorOptions.value = response.data.data.map((item: Kantor) => ({
      label: item.nama,
      value: item.id,
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data kantor";
    toast.error("Gagal", { description: errorMessage });
  }
};

// Helper functions untuk mendapatkan nama dari ID
const getTipePegawaiNama = (id: number): string => {
  const tipePegawai = tipePegawaiList.value.find((opt) => opt.id === id);
  return tipePegawai?.label || `ID: ${id}`;
};

const getKantorNama = (id: number): string => {
  const kantor = kantorOptions.value.find((opt) => opt.value === id);
  return kantor?.label || `ID: ${id}`;
};

const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: Pegawai): void => {
  router.push({ name: "app.pegawai.detail", params: { id: item.id } });
};

const handleEdit = (item: Pegawai): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Pegawai): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deletePegawai(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Pegawai berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus pegawai";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handlePegawaiDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// DataTable event handlers
const handleSort = (payload: { field: string; direction: "asc" | "desc" | undefined }): void => {
  addSort(payload.field, payload.direction);
};

const handleCustomFilter = (filters: Array<Record<string, any>>): void => {
  if (filters.length > 0) {
    const filterObj = filters[0];
    if (filterObj.type) {
      addFilter("type", filterObj.type);
    } else {
      removeFilter("type");
    }
  } else {
    clearFilters();
  }
};

const handleResetFilter = (): void => {
  filterValues.value = {};
  clearFilters();
};

// Lifecycle hooks
onMounted(() => {
  loadTipePegawaiOptions();
  loadKantorOptions();
});
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Pegawai</h1>
          <p class="text-muted-foreground">Daftar pegawai dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Pegawai</CardTitle>
          <CardDescription>List daftar pegawai dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data pegawai'" @retry="fetchData" />

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
            :current-page="pagination.current_page"
            :loading="isLoading"
            :filters="filterConfigs"
            :search-value="search"
            :sort-field="currentSortField"
            :sort-direction="currentSortDirection"
            :filter-values="filterValues"
            @page-change="handlePageChange"
            @search="handleSearch"
            @sort="handleSort"
            @custom-filter="handleCustomFilter"
            @reset-filter="handleResetFilter"
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
            @update:search-value="(val) => (search = val)"
            @update:filter-values="(val) => (filterValues = val)"
          >
            <!-- Custom column rendering for check radius -->
            <template #cell-checkRadius="{ item }">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  item.checkRadius === 'YA'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ item.checkRadius }}
              </span>
            </template>
          </DataTable>
        </CardContent>
      </Card>

      <!-- Pegawai Dialog -->
      <PegawaiDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :pegawai="dialog.state.value.data"
        :tipe-pegawai-options="tipePegawaiOptions"
        :kantor-options="kantorOptions"
        @success="handlePegawaiDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Pegawai"
        :description="`Apakah Anda yakin ingin menghapus pegawai '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
