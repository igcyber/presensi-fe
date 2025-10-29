import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { AnggotaFraksi, JabatanAnggota } from "./jabatanAnggota.types";
import type { User } from "./user.types";

/**
 * Struktur entity interface (recursive/hierarchical)
 * Represents organizational structure in the system with parent-child relationship
 */
export interface Struktur extends BaseEntity {
  nama: string;
  slug: string;
  tentang: string;
  tipe: string;
  strukturId: number | null;
  parent: Struktur | null;
  creator: User;
  updater: User | null;
  children: Struktur[];
  jabatanAnggota: JabatanAnggota[];
  anggotaFraksi: AnggotaFraksi[];
}

/**
 * Struktur list response interface
 * Represents paginated struktur data from API
 */
export type StrukturListResponse = PaginatedPayload<Struktur>;

/**
 * Struktur create request payload
 */
export interface CreateStrukturRequest {
  nama: string;
  tentang: string;
  strukturId?: number | null;
}

/**
 * Struktur update request payload
 */
export interface UpdateStrukturRequest {
  nama?: string;
  tentang?: string;
  strukturId?: number | null;
}

/**
 * Struktur query parameters for listing
 */
export interface StrukturQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Struktur detail response interface
 */
export type StrukturDetailResponse = Struktur;

/**
 * Simplified struktur for dropdown/select options
 */
export interface StrukturOption {
  label: string;
  value: number;
}
