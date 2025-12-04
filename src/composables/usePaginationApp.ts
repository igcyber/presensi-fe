// External imports
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Internal imports
import type { Filter, PaginationMeta, SearchParams, Sort } from "@/lib/api/core";

export function usePaginationApp(initialPerPage: number = 10, enableUrlSync: boolean = true) {
  // State declaration
  const route = enableUrlSync ? useRoute() : null;
  const router = enableUrlSync ? useRouter() : null;
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
  const sorts = ref<Sort>();
  const filters = ref<Filter[]>([]);
  const customFilters = ref<Array<Record<string, any>>>([]);

  // Initialization logic
  const initFromUrl = () => {
    if (!route || !enableUrlSync) return;

    const query = route.query;

    // Initialize pagination from URL
    if (query.page) {
      const page = Number(query.page);
      if (!isNaN(page) && page > 0) {
        pagination.current_page = page;
      }
    }
    if (query.limit) {
      const limit = Number(query.limit);
      if (!isNaN(limit) && limit > 0) {
        pagination.per_page = limit;
      }
    }

    // Initialize search from URL
    if (query.search && typeof query.search === "string") {
      search.value = query.search;
    }

    // Initialize sorting from URL (AdonisJS format: orderBy & sortBy)
    if (query.orderBy && typeof query.orderBy === "string") {
      const direction = (query.sortBy as "asc" | "desc") || "asc";
      sorts.value = { field: query.orderBy, direction };
    }

    // Initialize filters from URL
    // Support both direct params (role=admin) and filters[role]=admin format
    const urlFilters: Filter[] = [];
    for (const [key, value] of Object.entries(query)) {
      // Skip pagination, search, and sort params
      if (["page", "limit", "search", "orderBy", "sortBy"].includes(key)) continue;

      // Handle filters[field] format
      if (key.startsWith("filters[") && key.endsWith("]")) {
        const field = key.slice(8, -1);
        if (value && typeof value === "string") {
          urlFilters.push({ field, value, operator: "eq" });
        }
      } else if (value && typeof value === "string") {
        // Direct param format (e.g., role=admin)
        urlFilters.push({ field: key, value, operator: "eq" });
      }
    }
    if (urlFilters.length > 0) {
      filters.value = urlFilters;
    }
  };

  if (enableUrlSync && route) {
    initFromUrl();

    // Watch for URL changes (browser back/forward)
    watch(
      () => route.query,
      () => {
        initFromUrl();
      },
      { deep: true },
    );
  }

  // Computed properties
  const hasData = computed(() => pagination.total > 0);
  const hasNextPage = computed(() => pagination.current_page < pagination.last_page);
  const hasPrevPage = computed(() => pagination.current_page > 1);
  const startItem = computed(() => (pagination.current_page - 1) * pagination.per_page + 1);
  const endItem = computed(() => Math.min(pagination.current_page * pagination.per_page, pagination.total));

  // Query object untuk API (AdonisJS format)
  const query = computed<SearchParams>(() => {
    const params: SearchParams = {
      page: pagination.current_page,
      limit: pagination.per_page,
    };

    if (search.value) {
      params.search = search.value;
    }

    // AdonisJS format: orderBy & sortBy
    if (sorts.value) {
      const firstSort = sorts.value;
      // For API call, we can use both formats - backend should handle it
      // But for AdonisJS, we'll use orderBy and sortBy
      (params as any).orderBy = firstSort.field;
      (params as any).sortBy = firstSort.direction;
    }

    // Add filters as direct params for AdonisJS
    for (const filter of filters.value) {
      (params as any)[filter.field] = filter.value;
    }
    if (customFilters.value.length > 0) {
      (params as any).customFilters = customFilters.value;
    }

    return params;
  });

  // Private helper methods
  const updateUrl = () => {
    if (!router || !enableUrlSync) return;

    const queryParams: Record<string, string | number> = {};

    // Add pagination
    if (pagination.current_page > 1) {
      queryParams.page = pagination.current_page;
    }
    if (pagination.per_page !== initialPerPage) {
      queryParams.limit = pagination.per_page;
    }

    // Add search
    if (search.value) {
      queryParams.search = search.value;
    }

    // Add sorting (AdonisJS format: orderBy & sortBy)
    if (sorts.value) {
      queryParams.orderBy = sorts.value.field;
      queryParams.sortBy = sorts.value.direction;
    }

    // Add filters (support both direct and filters[field] format)
    for (const filter of filters.value) {
      // Use direct param format for simple filters
      queryParams[filter.field] = String(filter.value);
    }

    // Update URL without reload
    router.replace({
      query: queryParams,
    });
  };

  // Public pagination methods
  const setPagination = (newPagination: PaginationMeta) => {
    Object.assign(pagination, newPagination);
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      pagination.current_page = page;
      if (enableUrlSync) updateUrl();
    }
  };

  const setPerPage = (perPage: number) => {
    pagination.per_page = perPage;
    pagination.current_page = 1; // Reset ke page 1 ketika mengubah per_page
    if (enableUrlSync) updateUrl();
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

  // Search Methods
  const setSearch = (searchValue: string) => {
    search.value = searchValue;
    pagination.current_page = 1; // Reset ke page 1 ketika search
    if (enableUrlSync) updateUrl();
  };

  // Sort Methods
  const addSort = (field: string, direction: "asc" | "desc" | undefined) => {
    if (direction) {
      sorts.value = { field, direction };
    } else {
      removeSort();
    }
    pagination.current_page = 1; // Reset ke page 1 ketika sort
    if (enableUrlSync) updateUrl();
  };

  const removeSort = () => {
    if (sorts.value) {
      sorts.value = undefined;
      if (enableUrlSync) updateUrl();
    }
  };

  // Filter Methods
  const addFilter = (field: string, value: any, operator: Filter["operator"] = "eq") => {
    const existingIndex = filters.value.findIndex((f) => f.field === field);
    if (existingIndex >= 0) {
      filters.value[existingIndex] = { field, value, operator };
    } else {
      filters.value.push({ field, value, operator });
    }
    pagination.current_page = 1; // Reset ke page 1 ketika filter
    if (enableUrlSync) updateUrl();
  };

  const removeFilter = (field: string) => {
    const index = filters.value.findIndex((f) => f.field === field);
    if (index >= 0) {
      filters.value.splice(index, 1);
      if (enableUrlSync) updateUrl();
    }
  };

  const clearFilters = () => {
    filters.value = [];
    if (enableUrlSync) updateUrl();
  };

  // Custom Filter Methods
  const setCustomFilter = (filters: Array<Record<string, any>>) => {
    customFilters.value = filters;
    pagination.current_page = 1; // Reset ke page 1 ketika filter
    if (enableUrlSync) updateUrl();
  };

  const clearCustomFilter = () => {
    customFilters.value = [];
    if (enableUrlSync) updateUrl();
  };

  // Reset Method
  const reset = () => {
    pagination.current_page = 1;
    pagination.per_page = initialPerPage;
    pagination.total = 0;
    pagination.last_page = 0;
    pagination.first_page = 0;
    pagination.from = 0;
    pagination.to = 0;
    search.value = "";
    sorts.value = undefined;
    filters.value = [];
    customFilters.value = [];
    if (enableUrlSync && router) {
      router.replace({ query: {} });
    }
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

    // Pagination Methods
    setPagination,
    setPage,
    setPerPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    getPageNumbers,

    // Search Methods
    setSearch,

    // Sort Methods
    addSort,
    removeSort,

    // Filter Methods
    addFilter,
    removeFilter,
    clearFilters,

    // Custom Filter Methods
    setCustomFilter,
    clearCustomFilter,
    // Reset Method
    reset,
  };
}
