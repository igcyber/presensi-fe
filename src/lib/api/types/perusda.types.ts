import type { BaseEntity, PaginatedPayload, PaginatedPayloadPublic } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Perusda entity interface
 * Represents a perusda (regional company) record in the system
 */
export interface Perusda extends BaseEntity {
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  maps?: string | null;
  foto: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: Omit<User, "id,nip,roles">;
  updatedByUser: Omit<User, "id,nip,roles">;
  fotoUrl: string;
}

/**
 * Perusda list response interface
 * Represents paginated perusda data from API
 */
export type PerusdaListResponse = PaginatedPayload<Perusda>;

/**
 * Perusda list public response interface
 * Represents paginated perusda data from API
 */
export type PerusdaListPublicResponse = PaginatedPayloadPublic<Perusda, { perusdas: Perusda[] }>;

/**
 * Perusda create request payload
 */
export interface CreatePerusdaRequest {
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  maps?: string;
  foto?: File | string;
}

/**
 * Perusda update request payload
 */
export interface UpdatePerusdaRequest {
  nama?: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  maps?: string;
  foto?: File | string;
}

/**
 * Perusda query parameters for listing
 */
export interface PerusdaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "nama" | "alamat" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Perusda detail response interface
 */
export type PerusdaDetailResponse = Perusda;
