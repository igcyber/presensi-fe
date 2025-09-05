import type { BaseEntity, PaginationMeta } from "../core/apiResponse";

/**
 * Berita entity interface
 */
export interface Berita extends BaseEntity {
  opdId: number;
  judul: string;
  isi: string;
  foto: string;
}

/**
 * Berita detail with related data
 */
export interface BeritaDetail extends Berita {
  opd: {
    nama: string;
  };
}

/**
 * Berita sidebar item (simplified version)
 */
export interface BeritaSidebar extends BaseEntity {
  judul: string;
  foto: string;
}

/**
 * Berita list payload
 */
export interface BeritaListPayload {
  beritas: Berita[];
  meta?: PaginationMeta;
}

/**
 * Berita search parameters
 */
export interface BeritaSearchParams {
  page?: number;
  keyword?: string;
  opdId?: number;
  category?: string;
  sort?: "latest" | "popular" | "trending";
}

/**
 * Create berita request
 */
export interface CreateBeritaRequest {
  opdId: number;
  judul: string;
  isi: string;
  foto: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
}

/**
 * Update berita request
 */
export interface UpdateBeritaRequest {
  opdId?: number;
  judul?: string;
  isi?: string;
  foto?: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
  isPublished?: boolean;
}
