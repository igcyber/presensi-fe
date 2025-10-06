import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * PPID entity interface
 * Represents a PPID (Pejabat Pengelola Informasi dan Dokumentasi) document in the system
 */
export interface PPID extends BaseEntity {
  ppidId: string;
  kategori: string;
  subKategori: string;
  judul: string;
  keterangan: string;
  file: string | null;
  slug: string;
  tahun: string;
  jenisFile: string;
  ppid_json: string;
  createdByUser: Omit<User, "nip" | "roles">;
  updatedByUser?: Omit<User, "nip" | "roles">;
  fileUrl?: string;
}

/**
 * PPID list response interface
 * Represents paginated PPID data from API
 */
export type PPIDListResponse = PaginatedPayload<PPID>;

/**
 * PPID list public response interface
 * Represents paginated PPID data from API
 */
export type PPIDListPublicResponse = PaginatedPayload<Omit<PPID, "createdByUser" | "updatedByUser">>;

/**
 * PPID detail response interface
 */
export type PPIDDetailResponse = PPID;

/**
 * PPID create request payload
 */
export interface CreatePPIDRequest {
  judul: string;
  keterangan: string;
  kategori: string;
  date: string;
  jenisfile: string;
  file: File | string;
}

/**
 * PPID update request payload
 */
export interface UpdatePPIDRequest {
  judul?: string;
  keterangan?: string;
  kategori?: string;
  date?: string;
  jenisfile?: string;
  file?: File | string;
}

/**
 * PPID type enumeration
 * Represents the different types of PPID information
 */
export type PPIDType = "informasiberkala" | "informasisetiapsaat" | "informasisertamerta" | "informasidikecualikan";

/**
 * PPID query parameters for listing
 */
export interface PPIDQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "judul" | "kategori" | "tahun" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
  ppidType?: PPIDType;
}
