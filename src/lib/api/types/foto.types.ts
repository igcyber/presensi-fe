import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Foto entity interface
 * Represents a foto in the system
 */
export interface Foto extends BaseEntity {
  judul: string;
  foto: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
  fotoUrl: string;
  foto_url: string;
}

/**
 * Foto list response interface
 * Represents paginated foto data from API
 */
export type FotoListResponse = PaginatedPayload<Foto>;

/**
 * Foto list public response interface
 * Represents paginated foto data from API for public access
 */
export type FotoListPublicResponse = PaginatedPayload<Omit<Foto, "createdByUser,updatedByUser">>;

/**
 * Foto create request payload
 */
export interface CreateFotoRequest {
  judul: string;
  foto: File;
}

/**
 * Foto update request payload
 */
export interface UpdateFotoRequest {
  judul?: string;
  foto?: File;
}

/**
 * Foto query parameters for listing
 */
export interface FotoQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "judul" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Foto detail response interface
 */
export type FotoDetailResponse = Foto;
