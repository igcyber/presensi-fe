import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";
import type { JenisUsaha } from "./usaha.types";
import type { Pasar } from "./pasar.types";

/**
 * Kios entity interface
 * Represents a kios (stall) in the system
 */
export interface Kios extends BaseEntity {
  kode: string;
  jenisUsahaId: number;
  pasarId: number;
  jenisUsaha?: JenisUsaha;
  pasar?: Pasar;
}

/**
 * Kios detail response interface
 * Same as Kios for now, but can be extended with additional fields
 */
export interface KiosDetail extends Kios {}

/**
 * Kios list response interface
 * Represents paginated kios data from API
 */
export type KiosListResponse = PaginatedPayload<Kios>;

/**
 * Kios create request payload
 */
export interface CreateKiosRequest {
  kode: string;
  jenisUsahaId: number;
  pasarId: number;
}

/**
 * Kios update request payload
 */
export interface UpdateKiosRequest {
  kode?: string;
  jenisUsahaId?: number;
  pasarId?: number;
}

/**
 * Kios query parameters for listing
 */
export interface KiosQueryParams {
  page?: number;
  perPage?: number;
  per_page?: number;
  search?: string;
  sort_by?: "kode" | "jenisUsahaId" | "pasarId" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

