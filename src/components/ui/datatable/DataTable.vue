<script setup lang="ts" generic="T">
import { EditIcon, TrashIcon } from "lucide-vue-next";
import { computed, ref } from "vue";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TableSkeleton from "@/components/ui/loading/TableSkeleton.vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useFormatters } from "@/composables/useFormatters";

// Define column interface
export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (item: T) => string | number;
}

// Props
export interface Props<T = unknown> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  pagination?: boolean;
  pageSize: number;
  totalData: number;
  totalPages: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props<T>>(), {
  searchable: true,
  pagination: true,
  pageSize: 10,
  loading: false,
});

// Emits
const emit = defineEmits<{
  rowClick: [item: T];
  edit: [item: T];
  delete: [item: T];
  pageChange: [page: number];
  search: [search: string];
}>();

// Use formatters
const formatters = useFormatters();

// State
const searchQuery = ref("");
const currentPage = ref<number>(1);
const sortColumn = ref<string>("");
const sortDirection = ref<"asc" | "desc">("asc");

const startIndex = computed(() => {
  if (!props.pagination || !props.totalData) return 1;
  return (currentPage.value - 1) * props.pageSize + 1;
});

const endIndex = computed(() => {
  if (!props.pagination || !props.totalData) return 0;
  return Math.min(currentPage.value * props.pageSize, props.totalData);
});

// Methods
const handleSort = (column: Column<T>) => {
  if (!column.sortable) return;

  if (sortColumn.value === column.key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column.key;
    sortDirection.value = "asc";
  }
};

const handleRowClick = (item: T) => {
  emit("rowClick", item);
};

const handleEdit = (item: T) => {
  emit("edit", item);
};

const handleDelete = (item: T) => {
  emit("delete", item);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    currentPage.value = page;
    emit("pageChange", page);
  }
};

const getCellValue = (item: T, column: Column<T>) => {
  const value = item[column.key as keyof T];
  return column.render ? column.render(item) : value;
};

// Reset pagination when search changes
const handleSearch = () => {
  currentPage.value = 1;
  emit("search", searchQuery.value);
};

// Format cell value based on column type
const formatCellValue = (item: T, column: Column<T>) => {
  const value = getCellValue(item, column);

  // Handle different column types
  switch (column.key) {
    case "status":
      return formatters.status(value as string);
    case "amount":
    case "harga":
    case "total":
    case "biaya":
      return formatters.currency(value as number);
    case "createdAt":
    case "updatedAt":
    case "tanggal":
      return formatters.date(value as string);
    case "is_active":
    case "aktif":
      return formatters.activeStatus(value as boolean);
    case "phone":
    case "telepon":
    case "no_hp":
      return formatters.phone(value as string);
    case "email":
      return formatters.maskEmail(value as string);
    case "nama":
    case "name":
      return formatters.name(value as string);
    default:
      return value;
  }
};
</script>

<template>
  <div class="space-y-4">
    <!-- Search -->
    <div v-if="searchable" class="flex items-center space-x-2">
      <Input
        v-model="searchQuery"
        placeholder="Cari data..."
        id="searchKeyword"
        class="max-w-sm"
        @input="handleSearch"
      />
    </div>

    <!-- Loading State -->

    <TableSkeleton v-if="loading" />

    <!-- Table -->
    <div v-else class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width }"
              :class="[column.sortable ? 'hover:bg-muted/50 cursor-pointer' : '', 'select-none']"
              @click="handleSort(column)"
            >
              <div class="flex items-center space-x-2">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable" class="flex flex-col">
                  <svg
                    :class="[
                      'h-3 w-3 transition-colors',
                      sortColumn === column.key && sortDirection === 'asc'
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                    ]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </div>
              </div>
            </TableHead>
            <TableHead class="w-[100px] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="props.data.length === 0">
            <TableCell :colspan="columns.length + 1" class="h-24 text-center"> Tidak ada data. </TableCell>
          </TableRow>
          <TableRow
            v-for="(item, index) in props.data"
            :key="index"
            class="hover:bg-muted/50 cursor-pointer"
            @click="handleRowClick(item)"
          >
            <TableCell>
              {{ index + 1 + (currentPage - 1) * pageSize }}
            </TableCell>
            <TableCell
              v-for="column in columns"
              :key="column.key"
              :class="[
                'py-2',
                column.key === 'status' ? 'capitalize' : '',
                ['amount', 'harga', 'total', 'biaya'].includes(column.key) ? 'text-right font-medium' : '',
              ]"
            >
              <!-- Status, Aktif, Inaktif columns -->
              <template v-if="['status', 'is_active', 'aktif'].includes(column.key)">
                <span :class="['rounded-full px-2 py-1 text-xs', (formatCellValue(item, column) as any).class]">
                  {{ (formatCellValue(item, column) as any).label }}
                </span>
              </template>

              <!-- Currency columns -->
              <template v-else-if="['amount', 'harga', 'total', 'biaya'].includes(column.key)">
                {{ formatCellValue(item, column) }}
              </template>

              <!-- Date columns -->
              <template v-else-if="['created_at', 'updated_at', 'tanggal'].includes(column.key)">
                {{ formatCellValue(item, column) }}
              </template>

              <!-- Other columns -->
              <template v-else>
                {{ formatCellValue(item, column) }}
              </template>
            </TableCell>
            <TableCell class="py-2 text-center">
              <div class="flex items-center space-x-2">
                <Button variant="secondary" size="sm" @click.stop="handleEdit(item)">
                  <EditIcon class="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" @click.stop="handleDelete(item)">
                  <TrashIcon class="h-4 w-4" />
                  Hapus
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col items-center justify-between gap-4 space-x-2 py-4 sm:flex-row">
      <div class="text-muted-foreground w-full text-center text-sm sm:text-left">
        Menampilkan {{ startIndex }} - {{ endIndex }} dari {{ totalData }} data
      </div>

      <Pagination
        v-slot="{ page }"
        :items-per-page="pageSize"
        :total="totalData"
        :default-page="currentPage"
        :show-edges="true"
        :sibling-count="0"
        @update:page="goToPage"
        class="flex items-center justify-end"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious />

          <template v-for="(item, index) in items" :key="index">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
              {{ item.value }}
            </PaginationItem>

            <PaginationEllipsis v-else :index="index" />
          </template>

          <PaginationNext />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
