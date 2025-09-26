<script setup lang="ts">
import { FileText } from "lucide-vue-next";
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable, type FilterConfig } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { getSurveiKepuasan } from "@/lib/api/services/surveiKepuasan";
import type { SurveiKepuasan } from "@/lib/api/types/surveiKepuasan.types";

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
} = useResourceList<SurveiKepuasan>((params) => getSurveiKepuasan(params), { perPage: 10, searchDebounce: 500 });

const router = useRouter();
const { date, truncate } = useFormatters();

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    key: "startDate",
    label: "Tanggal Mulai",
    type: "date",
    placeholder: "Pilih tanggal mulai",
  },
  {
    key: "endDate",
    label: "Tanggal Akhir",
    type: "date",
    placeholder: "Pilih tanggal akhir",
  },
];

// Column definitions
const columns: Column<SurveiKepuasan>[] = [
  {
    key: "nama",
    label: "Nama Responden",
    sortable: true,
    searchable: true,
    width: "200px",
  },
  {
    key: "noHp",
    label: "No. HP",
    sortable: false,
    width: "150px",
  },
  {
    key: "jenisKelamin",
    label: "Jenis Kelamin",
    sortable: false,
    width: "120px",
    render: (item: SurveiKepuasan): string => {
      return item.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";
    },
  },
  {
    key: "pendidikan",
    label: "Pendidikan",
    sortable: false,
    width: "120px",
  },
  {
    key: "pekerjaan",
    label: "Pekerjaan",
    sortable: false,
    width: "150px",
    render: (item: SurveiKepuasan): string => {
      return truncate(item.pekerjaan, 20);
    },
  },
  {
    key: "createdAt",
    label: "Tanggal Survei",
    sortable: true,
    width: "150px",
    render: (item: SurveiKepuasan): string => {
      return date(item.createdAt);
    },
  },
];

// Event handlers
const handleRowClick = (item: SurveiKepuasan): void => {
  router.push({ name: "app.survei-kepuasan.detail", params: { id: item.id.toString() } });
};

// Lifecycle
onMounted(() => {
  fetchData();
});

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
          <h1 class="text-3xl font-bold tracking-tight">Survei Kepuasan Masyarakat</h1>
          <p class="text-muted-foreground">
            Daftar survei kepuasan masyarakat dengan fitur pencarian, pengurutan, dan paginasi
          </p>
        </div>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle class="flex items-center gap-2">
            <FileText class="h-5 w-5" />
            Survei Kepuasan Masyarakat
          </CardTitle>
          <CardDescription
            >List daftar survei kepuasan masyarakat dengan fitur pencarian, sorting, dan pagination</CardDescription
          >
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState
            v-if="isError"
            :message="error?.message || 'Gagal memuat data survei kepuasan'"
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
            :filters="filterConfig"
            :actions="false"
            @page-change="handlePageChange"
            @search="handleSearch"
            @custom-filter="handleCustomFilter"
            @row-click="handleRowClick"
            @reset-filter="reset"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
