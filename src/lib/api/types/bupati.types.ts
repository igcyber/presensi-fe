import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Bupati entity interface
 * Represents a bupati (regent) record in the system
 */
export interface Bupati extends BaseEntity {
  namaBupati: string;
  namaWakil: string;
  foto: string;
  tahunAwal: number;
  tahunAkhir: number;
  createdBy: number;
  updatedBy: number;
  createdByUser: Omit<User, "id,nip,roles">;
  updatedByUser: Omit<User, "id,nip,roles">;
  fotoUrl: string;
}

/**
 * Bupati list response interface
 * Represents paginated bupati data from API
 */
export type BupatiListResponse = PaginatedPayload<Bupati>;

/**
 * Bupati create request payload
 */
export interface CreateBupatiRequest {
  namaBupati: string;
  namaWakil: string;
  foto: File | string;
  tahunAwal: number;
  tahunAkhir: number;
}

/**
 * Bupati update request payload
 */
export interface UpdateBupatiRequest {
  namaBupati?: string;
  namaWakil?: string;
  foto?: File | string;
  tahunAwal?: number;
  tahunAkhir?: number;
}

/**
 * Bupati query parameters for listing
 */
export interface BupatiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "namaBupati" | "tahunAwal" | "tahunAkhir" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Bupati detail response interface
 */
export type BupatiDetailResponse = Bupati;
