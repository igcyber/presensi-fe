import type { BaseEntity, ContentData, PaginationMeta } from "@/lib/api/core/apiResponse";

/**
 * Content data type aliases for better semantic naming
 */
export type SejarahData = ContentData;
export type KependudukanData = ContentData;
export type PotensiDaerahData = ContentData;
export type PrestasiPenghargaanContentData = ContentData;

/**
 * Achievement/Award data interface
 */
export interface Prestasi extends BaseEntity {
  tahun: string;
  tingkat: string;
  nama: string;
  keterangan: string;
  foto?: string;
  kategori?: string;
  instansi?: string;
}

/**
 * Achievement/Award data payload interface
 */
export interface PrestasiPenghargaanDataPayload {
  data: ContentData;
  prestasis: Prestasi[];
  meta?: PaginationMeta;
}

/**
 * Achievement/Award list payload interface
 */
export interface PrestasiListPayload {
  prestasi: Prestasi[];
  meta?: PaginationMeta;
}

/**
 * Search parameters for achievements
 */
export interface PrestasiSearchParams {
  page?: number;
  keyword?: string;
  tahun?: string;
  tingkat?: string;
  kategori?: string;
  sort?: "latest" | "tahun" | "nama";
}

/**
 * Create achievement request
 */
export interface CreatePrestasiRequest {
  tahun: string;
  tingkat: string;
  nama: string;
  keterangan: string;
  foto?: string;
  kategori?: string;
  instansi?: string;
}

/**
 * Update achievement request
 */
export interface UpdatePrestasiRequest {
  tahun?: string;
  tingkat?: string;
  nama?: string;
  keterangan?: string;
  foto?: string;
  kategori?: string;
  instansi?: string;
}
