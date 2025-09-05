// Common types yang digunakan di berbagai bagian aplikasi

// Interface untuk pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Interface untuk response API yang menggunakan pagination
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  pagination: Pagination;
}

// Interface untuk response API standard (non-paginated)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Interface untuk error response
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Interface untuk meta information
export interface Meta {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

// Alternative pagination interface (jika API menggunakan format berbeda)
export interface AlternativePagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

// Interface untuk query parameters pagination
export interface PaginationQuery {
  page?: number;
  per_page?: number;
  limit?: number;
  offset?: number;
}

// Interface untuk sorting
export interface Sort {
  field: string;
  direction: "asc" | "desc";
}

// Interface untuk filtering
export interface Filter {
  field: string;
  value: any;
  operator?: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "nin";
}

// Interface untuk search dan filter query
export interface SearchQuery extends PaginationQuery {
  search?: string;
  sort?: Sort[];
  filters?: Filter[];
}
