import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Standar Pelayanan entity interface
 * Represents service standards in the system
 */
export interface StandarPelayanan extends BaseEntity {
  nama: string;
  deskripsi: string;
  creator: User | null;
  updater: User | null;
}

/**
 * Standar Pelayanan list response interface
 * Represents paginated standar pelayanan data from API
 */
export type StandarPelayananListResponse = PaginatedPayload<StandarPelayanan>;

/**
 * Standar Pelayanan detail response interface
 */
export type StandarPelayananDetailResponse = StandarPelayanan;

/**
 * Standar Pelayanan create request payload
 */
export interface CreateStandarPelayananRequest {
  nama: string;
  deskripsi: string;
}

/**
 * Standar Pelayanan update request payload
 */
export interface UpdateStandarPelayananRequest {
  nama?: string;
  deskripsi?: string;
}

/**
 * Standar Pelayanan query parameters for listing
 */
export interface StandarPelayananQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Simplified standar pelayanan for dropdown/select options
 */
export interface StandarPelayananOption {
  label: string;
  value: number;
}
