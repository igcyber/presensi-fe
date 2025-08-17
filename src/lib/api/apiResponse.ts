/**
 * Base API Response interface
 * @template T - The data type
 * @template M - Additional metadata type (defaults to PageMeta)
 */
export interface ApiResponse<T, M = PageMeta> {
  status?: string;
  data: T & M;
}

/**
 * Base interface for entities with timestamps
 */
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
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
 * Pagination related interfaces
 */
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  next: string | null;
  prev: string | null;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  from: number;
  to: number;
}

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
