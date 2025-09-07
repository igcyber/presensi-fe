import { computed, ref } from "vue";

// Generic response structure interface
export interface ApiResponse<T> {
  status: string;
  data: T;
}

// Enhanced useFetch with better TypeScript support
export function useFetch<TResponse, TData = TResponse>(
  apiFn: () => Promise<TResponse>,
  options?: {
    immediate?: boolean;
    extractData?: (response: TResponse) => TData;
  },
) {
  const data = ref<TData | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  const isError = computed(() => error.value !== null);
  const hasData = computed(() => data.value !== null);

  const fetchData = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiFn();

      // If extractData function is provided, use it to extract data
      if (options?.extractData) {
        data.value = options.extractData(response);
      } else {
        // Default behavior: assume response has nested data structure
        data.value = response as TData;
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      data.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const refresh = () => fetchData();

  const reset = () => {
    data.value = null;
    error.value = null;
    isLoading.value = false;
  };

  // Auto-fetch if immediate is true (default: false)
  if (options?.immediate !== false) {
    fetchData();
  }

  return {
    data,
    isLoading,
    error,
    isError,
    hasData,
    fetchData,
    refresh,
    reset,
  };
}
