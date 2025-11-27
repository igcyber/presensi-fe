import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

/**
 * Pasar entity interface
 * Represents a pasar (market) in the system
 */
export interface Pasar extends BaseEntity {
  nama: string;
  jenisPasar: string | null;
}

/**
 * Pasar detail response interface
 * Same as Pasar for now, but can be extended with additional fields
 */
export interface PasarDetail extends Pasar {}

/**
 * Pasar list response interface
 * Represents paginated pasar data from API
 */
export type PasarListResponse = PaginatedPayload<Pasar>;

/**
 * Pasar create request payload
 */
export interface CreatePasarRequest {
  nama: string;
  jenisPasar?: string | null;
}

/**
 * Pasar update request payload
 */
export interface UpdatePasarRequest {
  nama?: string;
  jenisPasar?: string | null;
}

/**
 * Pasar query parameters for listing
 */
export interface PasarQueryParams {
  page?: number;
  perPage?: number;
  per_page?: number;
  search?: string;
  sort_by?: "nama" | "jenisPasar" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}
