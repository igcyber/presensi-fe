import { computed, reactive, ref } from "vue";

import type { Filter, PaginationMeta, SearchParams, Sort } from "@/lib/api/core";

export function usePaginationApp(initialPerPage: number = 10) {
  // State
  const pagination = reactive<PaginationMeta>({
    current_page: 1,
    per_page: initialPerPage,
    total: 0,
    last_page: 0,
    first_page: 0,
    from: 0,
    to: 0,
  });

  const search = ref("");
  const sorts = ref<Sort[]>([]);
  const filters = ref<Filter[]>([]);
  const customFilters = ref<Array<Record<string, any>>>([]);

  // Computed
  const hasData = computed(() => pagination.total > 0);
  const hasNextPage = computed(() => pagination.current_page < pagination.last_page);
  const hasPrevPage = computed(() => pagination.current_page > 1);
  const startItem = computed(() => (pagination.current_page - 1) * pagination.per_page + 1);
  const endItem = computed(() => Math.min(pagination.current_page * pagination.per_page, pagination.total));

  // Query object untuk API
  const query = computed<SearchParams>(() => ({
    page: pagination.current_page,
    limit: pagination.per_page,
    search: search.value || undefined,
    sort: sorts.value.length > 0 ? sorts.value.map((s) => `${s.field}:${s.direction}`).join(",") : undefined,
    filters: filters.value.length > 0 ? filters.value : undefined,
    customFilters: customFilters.value.length > 0 ? customFilters.value : undefined,
  }));

  // Methods
  const setPagination = (newPagination: PaginationMeta) => {
    Object.assign(pagination, newPagination);
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      pagination.current_page = page;
    }
  };

  const setPerPage = (perPage: number) => {
    pagination.per_page = perPage;
    pagination.current_page = 1; // Reset ke page 1 ketika mengubah per_page
  };

  const nextPage = () => {
    if (hasNextPage.value) {
      pagination.current_page++;
    }
  };

  const prevPage = () => {
    if (hasPrevPage.value) {
      pagination.current_page--;
    }
  };

  const firstPage = () => {
    pagination.current_page = 1;
  };

  const lastPage = () => {
    pagination.current_page = pagination.last_page;
  };

  const setSearch = (searchValue: string) => {
    search.value = searchValue;
    pagination.current_page = 1; // Reset ke page 1 ketika search
  };

  const setCustomFilter = (filters: Array<Record<string, any>>) => {
    customFilters.value = filters;
  };

  const addSort = (field: string, direction: "asc" | "desc") => {
    const existingIndex = sorts.value.findIndex((s) => s.field === field);
    if (existingIndex >= 0) {
      sorts.value[existingIndex].direction = direction;
    } else {
      sorts.value.push({ field, direction });
    }
    pagination.current_page = 1; // Reset ke page 1 ketika sort
  };

  const removeSort = (field: string) => {
    const index = sorts.value.findIndex((s) => s.field === field);
    if (index >= 0) {
      sorts.value.splice(index, 1);
    }
  };

  const clearSorts = () => {
    sorts.value = [];
  };

  const addFilter = (field: string, value: any, operator: Filter["operator"] = "eq") => {
    const existingIndex = filters.value.findIndex((f) => f.field === field);
    if (existingIndex >= 0) {
      filters.value[existingIndex] = { field, value, operator };
    } else {
      filters.value.push({ field, value, operator });
    }
    pagination.current_page = 1; // Reset ke page 1 ketika filter
  };

  const removeFilter = (field: string) => {
    const index = filters.value.findIndex((f) => f.field === field);
    if (index >= 0) {
      filters.value.splice(index, 1);
    }
  };

  const clearFilters = () => {
    filters.value = [];
  };

  const reset = () => {
    pagination.current_page = 1;
    pagination.per_page = initialPerPage;
    pagination.total = 0;
    pagination.last_page = 0;
    pagination.first_page = 0;
    pagination.from = 0;
    pagination.to = 0;
    search.value = "";
    sorts.value = [];
    filters.value = [];
    customFilters.value = [];
  };

  // Generate page numbers untuk pagination UI
  const getPageNumbers = (maxVisible: number = 5) => {
    const pages: number[] = [];
    const totalPages = pagination.last_page;
    const currentPage = pagination.current_page;

    if (totalPages <= maxVisible) {
      // Jika total pages <= maxVisible, tampilkan semua
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Jika total pages > maxVisible, tampilkan dengan logic
      const halfVisible = Math.floor(maxVisible / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);

      // Adjust jika tidak cukup pages di salah satu sisi
      if (endPage - startPage + 1 < maxVisible) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxVisible - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisible + 1);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return {
    // State
    pagination,
    search,
    sorts,
    filters,
    customFilters,
    // Computed
    hasData,
    hasNextPage,
    hasPrevPage,
    startItem,
    endItem,
    query,

    // Methods
    setPagination,
    setPage,
    setPerPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setSearch,
    addSort,
    removeSort,
    clearSorts,
    addFilter,
    removeFilter,
    clearFilters,
    reset,
    getPageNumbers,
    setCustomFilter,
  };
}
