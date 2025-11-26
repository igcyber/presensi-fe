import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

/**
 * Jenis Usaha entity interface
 * Represents a jenis usaha (business type) in the system
 */
export interface JenisUsaha extends BaseEntity {
  nama: string;
  warna: string;
}

/**
 * Jenis Usaha detail response interface
 * Same as JenisUsaha for now, but can be extended with additional fields
 */
export interface JenisUsahaDetail extends JenisUsaha {}

/**
 * Jenis Usaha list response interface
 * Represents paginated jenis usaha data from API
 */
export type JenisUsahaListResponse = PaginatedPayload<JenisUsaha>;

/**
 * Jenis Usaha create request payload
 */
export interface CreateJenisUsahaRequest {
  nama: string;
  warna: string;
}

/**
 * Jenis Usaha update request payload
 */
export interface UpdateJenisUsahaRequest {
  nama?: string;
  warna?: string;
}

/**
 * Jenis Usaha query parameters for listing
 */
export interface JenisUsahaQueryParams {
  page?: number;
  perPage?: number;
  per_page?: number;
  search?: string;
  sort_by?: "nama" | "warna" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

