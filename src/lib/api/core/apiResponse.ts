/**
 * Generic API Response interface
 * @template T - The data type returned by the API
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
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
 * Base interface for entities with common fields
 */
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
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
 * Complete pagination response interface
 */
export interface PaginationResponse {
  links: PaginationLinks;
  meta: PaginationMeta;
}

/**
 * Page metadata interface for SEO and navigation
 */
export interface PageMeta {
  links?: PaginationLinks;
  meta?: PaginationMeta;
  pagers: string[];
  position: string;
  pagetitle: string;
}

/**
 * Generic list response interface
 * @template T - The item type in the list
 */
export interface ListResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

/**
 * Generic detail response interface
 * @template T - The data type
 */
export interface DetailResponse<T> {
  data: T;
}

/**
 * Search parameters interface
 */
export interface SearchParams {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string;
  order?: "asc" | "desc";
}

/**
 * Filter parameters interface
 */
export interface FilterParams {
  [key: string]: any;
}
