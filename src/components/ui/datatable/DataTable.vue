<script setup lang="ts" generic="T">
// External imports
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  EditIcon,
  Eye,
  RotateCcw,
  Search,
  TrashIcon,
} from "lucide-vue-next";
import { computed, ref } from "vue";

// Internal imports
import FilePreviewDialog from "@/components/dialogs/FilePreviewDialog.vue";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useFilePreview } from "@/composables/useFilePreview";
import { useFormatters } from "@/composables/useFormatters";

// Type definitions and interfaces
export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (item: T) => string | number;
  htmlContent?: boolean;
  stripHtml?: boolean;
  previewable?: boolean;
  previewUrl?: (item: T) => string;
  previewName?: (item: T) => string;
}

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "date";
  options?: FilterOption[];
  placeholder?: string;
}

export interface Props<T = unknown> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  pagination?: boolean;
  pageSize: number;
  totalData: number;
  totalPages: number;
  currentPage: number;
  loading?: boolean;
  filters?: FilterConfig[];
  actions?: boolean;
  actionEdit?: boolean;
  actionDelete?: boolean;
  searchValue?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc" | undefined;
  filterValues?: Record<string, any>;
}

// Props definition
const props = withDefaults(defineProps<Props<T>>(), {
  searchable: true,
  pagination: true,
  pageSize: 10,
  currentPage: 1,
  loading: false,
  filters: () => [],
  actions: true,
  actionEdit: true,
  actionDelete: true,
  searchValue: "",
  sortField: "",
  sortDirection: undefined,
  filterValues: () => ({}),
});

// Emits definition
const emit = defineEmits<{
  rowClick: [item: T];
  edit: [item: T];
  delete: [item: T];
  pageChange: [page: number];
  search: [search: string];
  sort: [payload: { field: string; direction: "asc" | "desc" | undefined }];
  customFilter: [filters: Array<Record<string, any>>];
  resetFilter: [];
  "update:searchValue": [value: string];
  "update:filterValues": [values: Record<string, any>];
}>();

// Composables initialization
const formatters = useFormatters();
const filePreview = useFilePreview();

// Reactive state
const localSearchQuery = ref(props.searchValue);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Computed properties
const startIndex = computed(() => {
  if (!props.pagination || !props.totalData) return 1;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const endIndex = computed(() => {
  if (!props.pagination || !props.totalData) return 0;
  return Math.min(props.currentPage * props.pageSize, props.totalData);
});

// Public event handlers
const handleSort = (column: Column<T>) => {
  if (!column.sortable) return;

  let direction: "asc" | "desc" | undefined = "asc";

  if (props.sortField === column.key) {
    direction = props.sortDirection === "asc" ? "desc" : props.sortDirection === "desc" ? undefined : "asc";
  }

  emit("sort", { field: column.key, direction });
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

const handlePreview = (item: T, column: Column<T>) => {
  if (!column.previewable || !column.previewUrl) return;

  const url = column.previewUrl(item);
  const name = column.previewName ? column.previewName(item) : undefined;

  if (url) {
    filePreview.previewFile({
      url,
      name,
    });
  }
};

const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    emit("search", localSearchQuery.value);
    emit("update:searchValue", localSearchQuery.value);
  }, 500);
};

const handleCustomFilter = (filters: Array<Record<string, any>>) => {
  emit("customFilter", filters);
};

// Navigation and pagination handlers
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("pageChange", page);
  }
};

// Filter methods
const handleFilterChange = (key: string, value: any) => {
  const newFilterValues = { ...props.filterValues, [key]: value };
  emit("update:filterValues", newFilterValues);

  const filters: Record<string, any> = {};
  Object.entries(newFilterValues).forEach(([filterKey, filterValue]) => {
    if (filterValue !== undefined && filterValue !== null && filterValue !== "") {
      filters[filterKey] = filterValue;
    }
  });

  const filterArray = Object.keys(filters).length > 0 ? [filters] : [];
  handleCustomFilter(filterArray);
};

const resetFilters = () => {
  localSearchQuery.value = "";
  emit("search", "");
  emit("update:searchValue", "");
  emit("update:filterValues", {});
  emit("resetFilter");
};

// Private helper methods
const stripHtmlTags = (html: string): string => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const getCellValue = (item: T, column: Column<T>) => {
  const value = item[column.key as keyof T];
  return column.render ? column.render(item) : value;
};

const formatCellValue = (item: T, column: Column<T>) => {
  const value = getCellValue(item, column);

  // Handle HTML content
  if (column.htmlContent && typeof value === "string") {
    return value;
  }

  // Handle strip HTML option
  if (column.stripHtml && typeof value === "string") {
    return stripHtmlTags(value);
  }

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
    default:
      return value;
  }
};
</script>

<template>
  <div class="space-y-4 p-2">
    <!-- Search and Filters Container - Horizontal Layout -->
    <div class="w-full">
      <div class="flex flex-wrap items-end gap-3">
        <!-- Search Input -->
        <div v-if="searchable" class="flex-1 min-w-[200px]">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="localSearchQuery"
              placeholder="Cari data..."
              id="searchKeyword"
              class="w-full pl-9 pr-3"
              @input="handleSearchInput"
            />
          </div>
        </div>

        <!-- Dynamic Filters -->
        <template v-for="filter in filters" :key="filter.key">
          <!-- Select Filter -->
          <div v-if="filter.type === 'select'" class="min-w-[180px]">
            <Select
              :model-value="filterValues[filter.key]"
              @update:model-value="(val) => handleFilterChange(filter.key, val)"
            >
              <SelectTrigger :id="`filter-${filter.key}`" class="w-full">
                <SelectValue :placeholder="filter.placeholder || filter.label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in filter.options" :key="option.value" :value="String(option.value)">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Date Filter -->
          <div v-else-if="filter.type === 'date'" class="min-w-[180px]">
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :id="`filter-${filter.key}`"
                  class="w-full justify-start text-left font-normal"
                  :class="!filterValues[filter.key] && 'text-muted-foreground'"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  <span v-if="filterValues[filter.key]">
                    {{ formatters.date(new Date(filterValues[filter.key])) }}
                  </span>
                  <span v-else>{{ filter.placeholder || "Pilih tanggal" }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar
                  :model-value="filterValues[filter.key]"
                  @update:model-value="(val) => handleFilterChange(filter.key, val)"
                  mode="single"
                  :week-start="1"
                />
              </PopoverContent>
            </Popover>
          </div>
        </template>

        <!-- Action Buttons -->
        <div v-if="filters && filters.length > 0" class="flex items-center gap-2">
          <Button variant="outline" @click="resetFilters" size="default" class="gap-2">
            <RotateCcw class="h-4 w-4" />
            <span class="hidden sm:inline">Reset</span>
          </Button>
        </div>

        <!-- Custom Action Buttons Slot -->
        <div class="flex-shrink-0">
          <slot name="actionButtons" />
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <TableSkeleton v-if="loading" />

  <!-- Table -->
  <div v-else class="rounded-md border">
    <div class="max-w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-14 text-center">No</TableHead>
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
                  <ChevronUp
                    :class="[
                      'h-3 w-3 transition-colors',
                      sortField === column.key && sortDirection === 'asc' ? 'text-foreground' : 'text-muted-foreground',
                    ]"
                  />
                  <ChevronDown
                    :class="[
                      '-mt-1 h-3 w-3 transition-colors',
                      sortField === column.key && sortDirection === 'desc'
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                    ]"
                  />
                </div>
              </div>
            </TableHead>
            <TableHead v-if="actions" class="w-[100px] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="props.data.length === 0">
            <TableCell :colspan="columns.length + 1" class="h-24 text-center"> Tidak ada data. </TableCell>
          </TableRow>
          <TableRow
            v-for="(item, index) in props.data"
            :key="index"
            class="hover:bg-muted/50 dark:hover:bg-accent cursor-pointer"
            @click="handleRowClick(item)"
          >
            <TableCell class="text-center">
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
              <!-- Scoped slot for custom column rendering -->
              <slot :name="`cell-${column.key}`" :item="item" :column="column" :value="formatCellValue(item, column)">
                <!-- Default rendering fallback -->
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
                <template v-else-if="['createdAt', 'updatedAt', 'tanggal'].includes(column.key)">
                  {{ formatCellValue(item, column) }}
                </template>

                <!-- HTML content columns -->
                <template v-else-if="column.htmlContent">
                  <div
                    v-html="formatCellValue(item, column)"
                    class="max-w-xs overflow-hidden"
                    :title="stripHtmlTags(String(formatCellValue(item, column)))"
                  ></div>
                </template>

                <!-- Strip HTML columns -->
                <template v-else-if="column.stripHtml">
                  <div class="max-w-xs truncate" :title="String(formatCellValue(item, column))">
                    {{ formatCellValue(item, column) }}
                  </div>
                </template>

                <!-- Previewable columns -->
                <template v-else-if="column.previewable && column.previewUrl">
                  <Button variant="link" size="sm" @click.stop="handlePreview(item, column)" class="p-0">
                    <span class="flex flex-col items-center justify-center gap-1 sm:flex-row">
                      <Eye v-if="column.previewUrl(item)" class="h-3 w-3" />
                      {{ formatCellValue(item, column) }}
                    </span>
                  </Button>
                </template>

                <!-- Other columns -->
                <template v-else>
                  {{ formatCellValue(item, column) }}
                </template>
              </slot>
            </TableCell>
            <TableCell v-if="actions" class="py-2 text-center">
              <div class="flex items-center justify-center gap-1 sm:gap-2">
                <Button
                  v-if="actionEdit"
                  variant="secondary"
                  size="sm"
                  @click.stop="handleEdit(item)"
                  class="px-2 sm:px-3"
                >
                  <EditIcon class="h-4 w-4" />
                  <span class="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  v-if="actionDelete"
                  variant="destructive"
                  size="sm"
                  @click.stop="handleDelete(item)"
                  class="px-2 sm:px-3"
                >
                  <TrashIcon class="h-4 w-4" />
                  <span class="hidden sm:inline">Hapus</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>

  <!-- Pagination -->
  <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
    <div class="text-muted-foreground order-2 w-full text-center text-xs sm:order-1 sm:text-left sm:text-sm">
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
      class="order-1 flex w-full items-center justify-center sm:order-2 sm:justify-end"
    >
      <PaginationContent v-slot="{ items }" class="gap-1">
        <PaginationPrevious class="h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm" />

        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
            class="h-8 w-8 text-xs sm:h-10 sm:w-10 sm:text-sm"
          >
            {{ item.value }}
          </PaginationItem>

          <PaginationEllipsis v-else :index="index" class="hidden sm:flex" />
        </template>

        <PaginationNext class="h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm" />
      </PaginationContent>
    </Pagination>
  </div>

  <!-- File Preview Dialog -->
  <FilePreviewDialog
    v-model:open="filePreview.isOpen.value"
    :file="filePreview.currentFile.value"
    :title="filePreview.options.value.title"
    :show-download="filePreview.options.value.showDownload"
    :show-external-link="filePreview.options.value.showExternalLink"
    :show-file-info="filePreview.options.value.showFileInfo"
    :max-width="filePreview.options.value.maxWidth"
    :max-height="filePreview.options.value.maxHeight"
    @download="filePreview.handleDownload"
    @external-link="filePreview.handleExternalLink"
  />
</template>
