import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { Opd } from "./opd.types";
import type { User } from "./user.types";

/**
 * Layanan entity interface
 * Represents a layanan (service) record in the system
 */
export interface Layanan extends BaseEntity {
  logo: string;
  nama: string;
  jenis: string;
  opdId: number;
  alamat: string;
  keterangan?: string | null;
  createdBy: number;
  updatedBy: number;
  createdByUser: Omit<User, "id,nip,roles">;
  updatedByUser: Omit<User, "id,nip,roles">;
  opd: Opd;
  logoUrl: string;
}

/**
 * Layanan list response interface
 * Represents paginated layanan data from API
 */
export type LayananListResponse = PaginatedPayload<Layanan>;

/**
 * Layanan create request payload
 */
export interface CreateLayananRequest {
  nama: string;
  jenis: string;
  opdId: number;
  alamat: string;
  keterangan?: string;
  logo?: File | string;
}

/**
 * Layanan update request payload
 */
export interface UpdateLayananRequest {
  nama?: string;
  jenis?: string;
  opdId?: number;
  alamat?: string;
  keterangan?: string;
  logo?: File | string;
}

/**
 * Layanan query parameters for listing
 */
export interface LayananQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "nama" | "jenis" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Layanan detail response interface
 */
export type LayananDetailResponse = Layanan;
