/**
 * Base interface for entities with common fields
 */
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  deletedAt?: string;
}

/**
 * Generic API Response interface
 * @template T - The data type returned by the API
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp?: string;
  status?: number;
  data: T;
}

/**
 * API Error interface for consistent error handling
 */
export interface ApiError {
  message: string;
  status: number;
  errors: Record<string, string[]>;
}

/**
 * Generic payload wrapper for single data responses
 * @template T - The data type
 */
export interface PayloadData<T> {
  data: T;
}

/**
 * Generic payload wrapper for paginated list responses
 * @template T - The item type in the list
 */
export interface PaginatedPayload<T> {
  data: T[];
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

/**
 * Generic payload wrapper for paginated list responses for public
 * @template T - The item type in the list
 */
export interface PaginatedPayloadPublic<T> {
  data: ContentData;
  [key: string]: T[] | unknown;
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  from: number;
  to: number;
}

/**
 * Pagination links interface
 */
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  next: string | null;
  prev: string | null;
}

/**
 * Search parameters interface
 */
export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  keyword?: string; // public
  sort?: string;
  order?: "asc" | "desc";
}

/**
 * Sort parameters interface
 */
export interface Sort {
  field: string;
  direction: "asc" | "desc";
}

/**
 * Filter parameters interface
 */
export interface Filter {
  field: string;
  value: unknown;
  operator?: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "nin";
}

/**
 * Content data structure for pages and articles
 */
export interface ContentData extends BaseEntity {
  nama: string;
  isi: string;
  slug: string;
  foto: string;
}
