// Base API Response interface
export type ApiResponse<T, M = PageMeta> = {
  status?: string;
  data: T & M;
};

// Content data structure
export interface ContentData {
  id: number;
  nama: string;
  isi: string;
  slug: string;
  foto: string;
  createdAt: string;
  updatedAt: string;
}

// Generic payload wrapper
export type PlayloadData<T> = {
  data: T;
};

// Pagination related interfaces
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

// Page metadata interface
export interface PageMeta {
  links?: PaginationLinks;
  meta?: PaginationMeta;
  pagers: string[];
  position: string;
  pagetitle: string;
}
