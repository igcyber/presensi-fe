import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Konten entity interface
 * Represents content pages in the system
 */
export interface Konten extends BaseEntity {
  nama: string;
  isi: string;
  slug: string;
  foto: string;
  fotoUrl: string;
  createdBy: number;
  updatedBy: number;
  creator: Omit<User, "id,nip,roles">;
  updater: Omit<User, "id,nip,roles">;
}

/**
 * Konten list response interface
 * Represents paginated konten data from API
 */
export type KontenListResponse = PaginatedPayload<Konten>;

/**
 * Konten create request payload
 */
export interface CreateKontenRequest {
  nama: string;
  isi: string;
  slug: string;
  foto?: File | string;
}

/**
 * Konten update request payload
 */
export interface UpdateKontenRequest {
  nama?: string;
  isi?: string;
  slug?: string;
  foto?: File | string;
}

/**
 * Konten query parameters for listing
 */
export interface KontenQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Konten detail response interface
 */
export type KontenDetailResponse = Konten;
