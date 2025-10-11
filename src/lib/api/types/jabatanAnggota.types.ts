import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { Struktur } from "./struktur.types";
import type { User } from "./user.types";

/**
 * JabatanAnggota entity interface (recursive/hierarchical)
 * Represents organizational member with hierarchical relationship and struktur relation
 */
export interface JabatanAnggota extends BaseEntity {
  nama: string;
  jabatan: string;
  foto: string;
  fotoUrl: string;
  anggotaId: number | null;
  strukturId: number;
  anggota: JabatanAnggota | null;
  anggotaChild: JabatanAnggota[];
  struktur: Struktur;
  creator: User;
  updater: User | null;
}

/**
 * JabatanAnggota list response interface
 * Represents paginated jabatan anggota data from API
 */
export type JabatanAnggotaListResponse = PaginatedPayload<JabatanAnggota>;

/**
 * JabatanAnggota create request payload
 */
export interface CreateJabatanAnggotaRequest {
  nama: string;
  jabatan: string;
  foto?: File | string;
  anggotaId?: number | null;
  strukturId: number;
}

/**
 * JabatanAnggota update request payload
 */
export interface UpdateJabatanAnggotaRequest {
  nama?: string;
  jabatan?: string;
  foto?: File | string;
  anggotaId?: number | null;
  strukturId?: number;
}

/**
 * JabatanAnggota query parameters for listing
 */
export interface JabatanAnggotaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  struktur_id?: number;
  sort_by?: "nama" | "jabatan" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * JabatanAnggota detail response interface
 */
export type JabatanAnggotaDetailResponse = JabatanAnggota;

/**
 * Simplified jabatan anggota for dropdown/select options
 */
export interface JabatanAnggotaOption {
  label: string;
  value: number;
}
