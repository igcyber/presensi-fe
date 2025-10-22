import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Kategori Dokumen entity interface
 * Represents a document category in the system
 */
export interface KategoriDokumen extends BaseEntity {
  nama: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: Omit<User, "nip,roles">;
  updatedByUser: Omit<User, "nip,roles">;
}

/**
 * Kategori Dokumen list response interface
 * Represents paginated kategori dokumen data from API
 */
export type KategoriDokumenListResponse = PaginatedPayload<KategoriDokumen>;

/**
 * Kategori Dokumen detail response interface
 */
export type KategoriDokumenDetailResponse = KategoriDokumen;

/**
 * Kategori Dokumen create request payload
 */
export interface CreateKategoriDokumenRequest {
  nama: string;
}

/**
 * Kategori Dokumen update request payload
 */
export interface UpdateKategoriDokumenRequest {
  nama?: string;
}

/**
 * Kategori Dokumen query parameters for listing
 */
export interface KategoriDokumenQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}
