// External imports
import { useDebounceFn } from "@vueuse/core";
import { computed, watch } from "vue";

// Internal imports
import { useFetch } from "@/composables/useFetch";
import { usePaginationApp } from "@/composables/usePaginationApp";
import type { ApiResponse, PaginatedPayload, SearchParams } from "@/lib/api/core";

/**
 * Reusable list state untuk resource apapun (users, roles, dsb.)
 * @param listFn - Function untuk fetch data dari API
 * @param options - Options untuk configuration
 * @param options.perPage - Items per page (default: 10)
 * @param options.searchDebounce - Debounce time untuk search (default: 500ms)
 * @param options.enableUrlSync - Enable URL query parameter sync (default: true)
 */
export function useResourceList<TItem>(
  listFn: (params?: SearchParams) => Promise<ApiResponse<PaginatedPayload<TItem>>>,
  options?: { perPage?: number; searchDebounce?: number; enableUrlSync?: boolean },
) {
  // Initialization
  const {
    pagination,
    query,
    search,
    sorts,
    setPagination,
    setPage,
    setSearch,
    setCustomFilter,
    addSort,
    addFilter,
    removeFilter,
    clearFilters,
    reset,
  } = usePaginationApp(options?.perPage ?? 10, options?.enableUrlSync ?? true);

  const fetcher = async (): Promise<ApiResponse<PaginatedPayload<TItem>>> => {
    return await listFn(query.value);
  };

  const { data, fetchData, isLoading, isError, error } = useFetch<
    ApiResponse<PaginatedPayload<TItem>>,
    PaginatedPayload<TItem>
  >(fetcher, {
    immediate: false,
    extractData: (resp) => resp.data,
    onSuccess: (payload: PaginatedPayload<TItem>) => {
      if (payload?.meta) setPagination(payload.meta);
    },
  });

  // Computed properties
  const items = computed(() => data.value?.data ?? []);
  const meta = computed(() => data.value?.meta);

  // Private methods
  const debouncedSearch = useDebounceFn((v: string) => setSearch(v), options?.searchDebounce ?? 500);

  // Public methods
  const handleSearch = (val: string) => debouncedSearch(val);
  const handleCustomFilter = (filters: Array<Record<string, any>>) => setCustomFilter(filters);
  const handlePageChange = (page: number) => setPage(page);

  // Watchers
  watch(
    query,
    () => {
      fetchData();
    },
    { immediate: true, deep: true },
  );

  return {
    // state
    items,
    meta,
    isLoading,
    isError,
    error,

    // control
    pagination,
    query,
    search,
    sorts,
    fetchData,
    handleSearch,
    handlePageChange,
    handleCustomFilter,
    addSort,
    addFilter,
    removeFilter,
    clearFilters,
    reset,
  };
}
