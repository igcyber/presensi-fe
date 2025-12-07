<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import moment from "moment";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import HariLiburDialog from "@/components/dialogs/HariLiburDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteHariLibur, getHariLiburList } from "@/lib/api/services/hariLibur";
import type { HariLibur } from "@/lib/api/types/hariLibur.types";
import { formatDate } from "@/lib/utils/formatters";

const router = useRouter();
const selectedDateString = ref<string | null>(null);
const filterValues = ref<Record<string, any>>({});

const fetcher = async (params?: any) => {
  const queryParams: any = {
    ...params,
    date: selectedDateString.value || undefined,
  };

  return await getHariLiburList(queryParams);
};

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
} = useResourceList<HariLibur>(fetcher, { perPage: 10, enableUrlSync: true });

const handleCustomFilter = (filters: Array<Record<string, any>>): void => {
  if (filters.length > 0) {
    const filterObj = filters[0];
    if (filterObj.date) {
      const dateValue = filterObj.date;
      // Handle DateValue (CalendarDate object)
      if (typeof dateValue === "object" && "year" in dateValue && "month" in dateValue && "day" in dateValue) {
        selectedDateString.value = moment({
          year: dateValue.year,
          month: dateValue.month - 1,
          day: dateValue.day,
        }).format("YYYY-MM-DD");
      }
      // Handle Date object
      else if (dateValue instanceof Date) {
        selectedDateString.value = moment(dateValue).format("YYYY-MM-DD");
      }
      // Handle string
      else if (typeof dateValue === "string") {
        const parsed = moment(dateValue);
        if (parsed.isValid()) {
          selectedDateString.value = parsed.format("YYYY-MM-DD");
        } else {
          selectedDateString.value = null;
        }
      }
    } else {
      selectedDateString.value = null;
    }
  } else {
    selectedDateString.value = null;
  }
};

const handleResetFilter = (): void => {
  filterValues.value = {};
  selectedDateString.value = null;
};

watch(selectedDateString, () => {
  fetchData();
});

const dialog = useDialog<HariLibur>();
const confirmDialog = useDialog<HariLibur>();

const currentSortField = computed(() => (sorts.value ? sorts.value.field : ""));
const currentSortDirection = computed(() => (sorts.value ? sorts.value.direction : "asc"));

const filterConfigs = computed<FilterConfig[]>(() => [
  {
    key: "date",
    label: "Tanggal",
    type: "date",
    placeholder: "Filter berdasarkan tanggal",
  },
]);

const columns: Column<HariLibur>[] = [
  {
    key: "tanggal",
    label: "Tanggal",
    sortable: true,
    render: (item: HariLibur) => formatDate(item.tanggal),
  },
  {
    key: "keterangan",
    label: "Keterangan",
    searchable: true,
  },
];

const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: HariLibur): void => {
  router.push({ name: "app.hari-libur.detail", params: { id: item.id } });
};

const handleEdit = (item: HariLibur): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: HariLibur): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deleteHariLibur(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Hari libur berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus hari libur";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handleSort = (payload: { field: string; direction: "asc" | "desc" | undefined }): void => {
  addSort(payload.field, payload.direction);
};

const handleHariLiburDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Hari Libur</h1>
          <p class="text-muted-foreground">Daftar hari libur dengan fitur pencarian, filter tanggal, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Hari Libur</CardTitle>
          <CardDescription>List daftar hari libur dengan fitur pencarian, filter tanggal, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data hari libur'" @retry="fetchData" />

          <template v-else>
            <!-- Data Table -->
            <DataTable
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
            />
          </template>
        </CardContent>
      </Card>

      <!-- Hari Libur Dialog -->
      <HariLiburDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :hari-libur="dialog.state.value.data"
        @success="handleHariLiburDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Hari Libur"
        :description="`Apakah Anda yakin ingin menghapus hari libur '${confirmDialog.state.value.data?.keterangan || formatDate(confirmDialog.state.value.data?.tanggal)}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
