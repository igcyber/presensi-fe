import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { Opd } from "./opd.types";
import type { User } from "./user.types";

/**
 * Berita entity interface
 * Represents a news article in the system
 */
export interface Berita extends BaseEntity {
  opdId: number;
  judul: string;
  isi: string;
  foto: string;
  keterangan?: string | null;
  tag: string;
  createdBy: number;
  updatedBy: number;
  opd: Omit<Opd, "createdByUser,updatedByUser">;
  creator: Omit<User, "id,nip,roles">;
  updater: Omit<User, "id,nip,roles">;
  fotoUrl: string;
}

/**
 * Berita sidebar interface
 * Represents simplified berita data for sidebar display
 */
export interface BeritaSidebar {
  id: number;
  judul: string;
  foto: string;
  createdAt: string;
  fotoUrl: string;
}

/**
 * Berita list response interface
 * Represents paginated berita data from API
 */
export type BeritaListResponse = PaginatedPayload<Berita>;

/**
 * Berita list public response interface
 * Represents paginated berita data from API
 */
export type BeritaListPublicResponse = PaginatedPayload<Omit<Berita, "opd,creator,updater">>;

/**
 * Berita create request payload
 */
export interface CreateBeritaRequest {
  opdId: number;
  judul: string;
  isi: string;
  foto?: File | string;
  keterangan?: string;
  tag: string;
}

/**
 * Berita update request payload
 */
export interface UpdateBeritaRequest {
  opdId?: number;
  judul?: string;
  isi?: string;
  foto?: File | string;
  keterangan?: string;
  tag?: string;
}

/**
 * Berita query parameters for listing
 */
export interface BeritaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  keyword?: string; // public
  date?: string;
  sort_by?: "judul" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Berita detail response interface
 */
export type BeritaDetailResponse = Berita;

/**
 * Berita detail public response interface
 */
export type BeritaDetailPublicResponse = Omit<Berita, "creator,updater">;
