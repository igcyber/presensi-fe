import { useDebounceFn } from "@vueuse/core";
import { computed } from "vue";

import { useFetch } from "@/composables/useFetch";
import { usePaginationApp } from "@/composables/usePaginationApp";
import type { ApiResponse, PaginatedPayload, SearchParams } from "@/lib/api/core";

/**
 * Reusable list state untuk resource apapun (users, roles, dsb.)
 */
export function useResourceList<TItem>(
  listFn: (params?: SearchParams) => Promise<ApiResponse<PaginatedPayload<TItem>>>,
  options?: { perPage?: number; searchDebounce?: number },
) {
  const { pagination, query, setPagination, setPage, setSearch, setCustomFilter } = usePaginationApp(
    options?.perPage ?? 10,
  );

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

  const items = computed(() => data.value?.data ?? []);
  const meta = computed(() => data.value?.meta);

  // search debounced
  const debouncedSearch = useDebounceFn((v: string) => setSearch(v), options?.searchDebounce ?? 500);
  const handleSearch = (val: string) => debouncedSearch(val);
  const handleCustomFilter = (filters: Array<Record<string, any>>) => setCustomFilter(filters);
  const handlePageChange = (page: number) => setPage(page);

  // auto fetch ketika query berubah & fetch pertama
  // lakukan di tempat pemanggil: watch(query, fetchData, { deep: true, immediate: true });
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
    fetchData,
    handleSearch,
    handlePageChange,
    handleCustomFilter,
  };
}
