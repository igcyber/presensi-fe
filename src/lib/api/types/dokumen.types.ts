import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Dokumen entity interface
 * Represents a document in the system
 */
export interface Dokumen extends BaseEntity {
  nama: string;
  file: string;
  isi: string;
  kategoriId: number;
  createdBy: number;
  updatedBy: number;
  createdByUser: Omit<User, "nip,roles">;
  updatedByUser: Omit<User, "nip,roles">;
  fileUrl: string;
  kategoriDokumen?: {
    id: number;
    nama: string;
  };
}

/**
 * Dokumen list response interface
 * Represents paginated dokumen data from API
 */
export type DokumenListResponse = PaginatedPayload<Dokumen>;

/**
 * Dokumen list public response interface
 * Represents paginated dokumen data from API
 */
export type DokumenListPublicResponse = PaginatedPayload<Omit<Dokumen, "createdByUser,updatedByUser">>;

/**
 * Dokumen detail response interface
 */
export type DokumenDetailResponse = Dokumen;

/**
 * Dokumen create request payload
 */
export interface CreateDokumenRequest {
  nama: string;
  file: File | string;
  isi: string;
  kategoriId: number;
}

/**
 * Dokumen update request payload
 */
export interface UpdateDokumenRequest {
  nama?: string;
  file?: File | string;
  isi?: string;
  kategoriId?: number;
}

/**
 * Dokumen query parameters for listing
 */
export interface DokumenQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  kategoriId?: number;
  customFilters?: Array<Record<string, any>>;
}
