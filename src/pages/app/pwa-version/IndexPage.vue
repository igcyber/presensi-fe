<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";

import PwaVersionDialog from "@/components/dialogs/PwaVersionDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";
import { Badge } from "@/components/ui/badge";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { getPwaVersionList, getPwaVersionLatest } from "@/lib/api/services/pwaVersion";
import type { PwaVersion, PwaVersionLatest } from "@/lib/api/types/pwaVersion.types";

const latestVersion = ref<PwaVersionLatest | null>(null);
const isLoadingLatest = ref(false);
const isErrorLatest = ref(false);

const fetcher = async (params?: any) => {
  return await getPwaVersionList(params);
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
} = useResourceList<PwaVersion>(fetcher, { perPage: 10, enableUrlSync: true });

const loadLatestVersion = async (): Promise<void> => {
  try {
    isLoadingLatest.value = true;
    isErrorLatest.value = false;
    const response = await getPwaVersionLatest();
    latestVersion.value = response.data;
  } catch (err: unknown) {
    isErrorLatest.value = true;
    const errorMessage = err instanceof Error ? err.message : "Gagal memuat versi terbaru";
    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    isLoadingLatest.value = false;
  }
};

onMounted(() => {
  loadLatestVersion();
});

const dialog = useDialog<PwaVersion>();

const currentSortField = computed(() => (sorts.value ? sorts.value.field : ""));
const currentSortDirection = computed(() => (sorts.value ? sorts.value.direction : "asc"));

const columns: Column<PwaVersion>[] = [
  {
    key: "version",
    label: "Version",
    sortable: true,
    searchable: true,
  },
  {
    key: "key",
    label: "Key",
    searchable: true,
  },
];

const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleSort = (payload: { field: string; direction: "asc" | "desc" | undefined }): void => {
  addSort(payload.field, payload.direction);
};

const handlePwaVersionDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
  loadLatestVersion();
};
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">PWA Version</h1>
          <p class="text-muted-foreground">Daftar versi PWA dengan fitur pencarian dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <!-- Latest Version Card -->
      <Card>
        <CardHeader class="px-8">
          <CardTitle>Versi yang Sedang Digunakan</CardTitle>
          <CardDescription>Informasi versi PWA yang sedang aktif</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoadingLatest" class="flex items-center justify-center py-8">
            <span class="text-muted-foreground">Memuat...</span>
          </div>
          <div v-else-if="isErrorLatest" class="flex items-center justify-center py-8">
            <span class="text-destructive">Gagal memuat versi terbaru</span>
          </div>
          <div v-else-if="latestVersion" class="flex items-center gap-4">
            <Badge variant="default" class="text-lg px-4 py-2">
              {{ latestVersion.version }}
            </Badge>
            <div class="flex flex-col">
              <span class="text-sm text-muted-foreground">Key:</span>
              <span class="font-mono text-sm">{{ latestVersion.key }}</span>
            </div>
          </div>
          <div v-else class="flex items-center justify-center py-8">
            <span class="text-muted-foreground">Tidak ada versi yang tersedia</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Daftar Versi PWA</CardTitle>
          <CardDescription>List daftar versi PWA dengan fitur pencarian dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data versi PWA'" @retry="fetchData" />

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
              :search-value="search"
              :sort-field="currentSortField"
              :sort-direction="currentSortDirection"
              :actions="false"
              @page-change="handlePageChange"
              @search="handleSearch"
              @sort="handleSort"
              @update:search-value="(val) => (search = val)"
            />
          </template>
        </CardContent>
      </Card>

      <!-- PWA Version Dialog -->
      <PwaVersionDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :pwa-version="dialog.state.value.data"
        @success="handlePwaVersionDialogSuccess"
      />
    </div>
  </div>
</template>
