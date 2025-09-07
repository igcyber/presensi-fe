import { computed, reactive, ref } from "vue";

import type { Filter, Pagination, PaginationQuery, Sort } from "@/types/common";

export function usePaginationApp(initialPerPage: number = 10) {
  // State
  const pagination = reactive<Pagination>({
    page: 1,
    limit: initialPerPage,
    total: 0,
    totalPages: 0,
  });

  const loading = ref(false);
  const search = ref("");
  const sorts = ref<Sort[]>([]);
  const filters = ref<Filter[]>([]);

  // Computed
  const hasData = computed(() => pagination.total > 0);
  const hasNextPage = computed(() => pagination.page < pagination.totalPages);
  const hasPrevPage = computed(() => pagination.page > 1);
  const startItem = computed(() => (pagination.page - 1) * pagination.limit + 1);
  const endItem = computed(() => Math.min(pagination.page * pagination.limit, pagination.total));

  // Query object untuk API
  const query = computed<PaginationQuery>(() => ({
    page: pagination.page,
    limit: pagination.limit,
    search: search.value || undefined,
    sort: sorts.value.length > 0 ? sorts.value : undefined,
    filters: filters.value.length > 0 ? filters.value : undefined,
  }));

  // Methods
  const setPagination = (newPagination: Pagination) => {
    Object.assign(pagination, newPagination);
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      pagination.page = page;
    }
  };

  const setPerPage = (perPage: number) => {
    pagination.limit = perPage;
    pagination.page = 1; // Reset ke page 1 ketika mengubah per_page
  };

  const nextPage = () => {
    if (hasNextPage.value) {
      pagination.page++;
    }
  };

  const prevPage = () => {
    if (hasPrevPage.value) {
      pagination.page--;
    }
  };

  const firstPage = () => {
    pagination.page = 1;
  };

  const lastPage = () => {
    pagination.page = pagination.totalPages;
  };

  const setSearch = (searchValue: string) => {
    search.value = searchValue;
    pagination.page = 1; // Reset ke page 1 ketika search
  };

  const addSort = (field: string, direction: "asc" | "desc") => {
    const existingIndex = sorts.value.findIndex((s) => s.field === field);
    if (existingIndex >= 0) {
      sorts.value[existingIndex].direction = direction;
    } else {
      sorts.value.push({ field, direction });
    }
    pagination.page = 1; // Reset ke page 1 ketika sort
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
    pagination.page = 1; // Reset ke page 1 ketika filter
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
    pagination.page = 1;
    pagination.limit = initialPerPage;
    pagination.total = 0;
    pagination.totalPages = 0;
    search.value = "";
    sorts.value = [];
    filters.value = [];
  };

  // Generate page numbers untuk pagination UI
  const getPageNumbers = (maxVisible: number = 5) => {
    const pages: number[] = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

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
    loading,
    search,
    sorts,
    filters,

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
  };
}
