import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Prestasi entity interface
 * Represents a prestasi/achievement record in the system
 */
export interface Prestasi extends BaseEntity {
  tahun: string;
  judul: string;
  tingkat: string;
  nama: string;
  keterangan: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: Omit<User, "id,nip,roles">;
  updatedByUser: Omit<User, "id,nip,roles">;
}

/**
 * Prestasi list response interface
 * Represents paginated prestasi data from API
 */
export type PrestasiListResponse = PaginatedPayload<Prestasi>;

/**
 * Prestasi create request payload
 */
export interface CreatePrestasiRequest {
  tahun: string;
  judul: string;
  tingkat?: string;
  nama?: string;
  keterangan?: string;
}

/**
 * Prestasi update request payload
 */
export interface UpdatePrestasiRequest {
  tahun?: string;
  judul?: string;
  tingkat?: string;
  nama?: string;
  keterangan?: string;
}

/**
 * Prestasi query parameters for listing
 */
export interface PrestasiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "tahun" | "judul" | "tingkat" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Prestasi detail response interface
 */
export type PrestasiDetailResponse = Prestasi;

/**
 * Tingkat options for prestasi
 */
export const TINGKAT_OPTIONS = [
  { label: "Semua Tingkat", value: "" },
  { label: "Regional", value: "Regional" },
  { label: "Provinsi", value: "Provinsi" },
  { label: "Nasional", value: "Nasional" },
  { label: "Internasional", value: "Internasional" },
] as const;
