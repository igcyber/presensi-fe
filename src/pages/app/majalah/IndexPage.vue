<script setup lang="ts">
import { Filter, PlusIcon, RotateCcw } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import MajalahDialog from "@/components/dialogs/MajalahDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteMajalah, getMajalahs } from "@/lib/api/services/majalah";
import type { Majalah } from "@/lib/api/types/majalah.types";
import { generateYearOptions, MONTH_OPTIONS } from "@/lib/api/types/majalah.types";

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
} = useResourceList<Majalah>((params) => getMajalahs(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<Majalah>();
const confirmDialog = useDialog<Majalah>();
const router = useRouter();

// Reactive state
const customFilters = ref<Array<Record<string, any>>>([]);
const selectedBulan = ref<string>("");
const selectedTahun = ref<string>("");

// Options
const monthOptions = ref([...MONTH_OPTIONS.map((option) => ({ ...option, value: String(option.value) }))]);
const yearOptions = ref([...generateYearOptions(2020).map((option) => ({ ...option, value: String(option.value) }))]);

// Column definitions
const columns: Column<Majalah>[] = [
  {
    key: "bulan",
    label: "Bulan",
    sortable: true,
    width: "150px",
    render: (item: Majalah): string => {
      const month = MONTH_OPTIONS.find((m) => m.value === item.bulan);
      return month?.label || "Unknown";
    },
  },
  {
    key: "tahun",
    label: "Tahun",
    sortable: true,
    width: "100px",
  },
  {
    key: "link",
    label: "File",
    width: "200px",
    render: (item: Majalah): string => item.link.split("/").pop() || item.link,
  },
  {
    key: "creator",
    label: "Pembuat",
    sortable: true,
    width: "150px",
    render: (item: Majalah): string => item.creator.fullName,
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

const handleRowClick = (item: Majalah): void => {
  router.push({ name: "app.majalah.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Majalah): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Majalah): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const majalah = confirmDialog.state.value.data;

    await deleteMajalah(majalah.id);
    fetchData();

    const monthName = MONTH_OPTIONS.find((m) => m.value === majalah.bulan)?.label || "Unknown";
    toast.success("Berhasil menghapus majalah", {
      description: `Majalah ${monthName} ${majalah.tahun} telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus majalah";
    toast.error("Gagal menghapus majalah", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleMajalahDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

const applyCustomFilter = (onFilterChange: (filters: Array<Record<string, any>>) => void) => {
  const filters: Record<string, any> = {};

  if (selectedBulan.value && selectedBulan.value !== "") {
    filters.bulan = Number(selectedBulan.value);
  }

  if (selectedTahun.value && selectedTahun.value !== "") {
    filters.tahun = Number(selectedTahun.value);
  }

  customFilters.value = Object.keys(filters).length > 0 ? [filters] : [];
  onFilterChange(customFilters.value);
};

const resetCustomFilter = (onFilterChange: (filters: Array<Record<string, any>>) => void) => {
  selectedBulan.value = "";
  selectedTahun.value = "";
  customFilters.value = [];
  onFilterChange([]);
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
          <h1 class="text-3xl font-bold tracking-tight">Majalah</h1>
          <p class="text-muted-foreground">Daftar majalah dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Majalah</CardTitle>
          <CardDescription>List daftar majalah dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data majalah'" @retry="fetchData" />

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
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
          >
            <!-- Custom Filter -->
            <template #filters="{ onFilterChange }">
              <div class="space-y-4">
                <!-- Filter Controls -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <!-- Filter Bulan -->
                  <div class="flex flex-col gap-1.5">
                    <Label for="filter-bulan" class="text-sm font-medium">Bulan</Label>
                    <Select v-model="selectedBulan">
                      <SelectTrigger id="filter-bulan" class="w-full">
                        <SelectValue placeholder="Pilih bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="option in monthOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Filter Tahun -->
                  <div class="flex flex-col gap-1.5">
                    <Label for="filter-tahun" class="text-sm font-medium">Tahun</Label>
                    <Select v-model="selectedTahun">
                      <SelectTrigger id="filter-tahun" class="w-full">
                        <SelectValue placeholder="Pilih tahun" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="option in yearOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Tombol Action -->
                  <div class="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
                    <Label class="text-sm font-medium opacity-0">Action</Label>
                    <div class="flex gap-2">
                      <Button variant="default" class="flex-1 sm:flex-none" @click="applyCustomFilter(onFilterChange)">
                        <Filter class="mr-2 h-4 w-4" />
                        Terapkan Filter
                      </Button>
                      <Button variant="outline" class="flex-1 sm:flex-none" @click="resetCustomFilter(onFilterChange)">
                        <RotateCcw class="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DataTable>
        </CardContent>
      </Card>

      <!-- Majalah Dialog -->
      <MajalahDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :majalah="dialog.state.value.data"
        widthClass="sm:max-w-[600px]"
        @success="handleMajalahDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Majalah"
        :description="`Apakah Anda yakin ingin menghapus majalah ini? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
