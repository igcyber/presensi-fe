import { ref } from "vue";

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function usePagination() {
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalItems = ref(0);
  const itemsPerPage = ref(10);

  const setPagination = (pagination: Pagination) => {
    currentPage.value = pagination.currentPage;
    totalPages.value = pagination.totalPages;
    totalItems.value = pagination.totalItems;
    itemsPerPage.value = pagination.itemsPerPage;
  };

  const paginate = (items: any[]) => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return items.slice(start, end);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setPagination,
    paginate,
  };
}
