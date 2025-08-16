import { ref } from "vue";

export type PaginationItem = number | "…";

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

  const range = (start: number, end: number): number[] =>
    start > end ? [] : Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const buildPagination = (
    totalPages: number,
    currentPage: number,
    boundaryCount = 1,
    siblingCount = 1,
  ): PaginationItem[] => {
    const total = Math.max(1, totalPages);
    const current = Math.min(Math.max(1, currentPage), total);

    // Jika total kecil, tampilkan semua tanpa ellipsis
    const maxWithoutEllipsis = boundaryCount * 2 + siblingCount * 2 + 3; // 3 = current + dua "jembatan"
    if (total <= maxWithoutEllipsis) return range(1, total);

    const startPages = range(1, boundaryCount);
    const endPages = range(Math.max(total - boundaryCount + 1, boundaryCount + 1), total);

    const left = Math.max(current - siblingCount, boundaryCount + 2);
    const right = Math.min(current + siblingCount, total - boundaryCount - 1);

    const middlePages = range(left, right);

    const showLeftEllipsis = left > boundaryCount + 2; // ada gap di kiri
    const showLeftBridge = left === boundaryCount + 2; // tepat bersisian → tampilkan 1 halaman jembatan

    const showRightEllipsis = right < total - boundaryCount - 1; // ada gap di kanan
    const showRightBridge = right === total - boundaryCount - 1;

    const items: PaginationItem[] = [
      ...startPages,
      ...(showLeftEllipsis ? ["…" as const] : showLeftBridge ? [boundaryCount + 1] : []),
      ...middlePages,
      ...(showRightEllipsis ? ["…" as const] : showRightBridge ? [total - boundaryCount] : []),
      ...endPages,
    ];

    return items;
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setPagination,
    paginate,
    buildPagination,
  };
}
