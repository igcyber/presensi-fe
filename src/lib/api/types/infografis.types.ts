import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Infografis entity interface
 * Represents infografis in the system
 */
export interface Infografis extends BaseEntity {
  nama: string;
  foto: string;
  url?: string;
  status: "1" | "0";
  isi?: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
  fileUrl: string;
  foto_url: string;
}

/**
 * Infografis list response interface
 * Represents paginated infografis data from API
 */
export type InfografisListResponse = PaginatedPayload<Infografis>;

/**
 * Infografis list public response interface
 * Represents paginated infografis data from API
 */
export type InfografisListPublicResponse = PaginatedPayload<Omit<Infografis, "createdByUser,updatedByUser">>;

/**
 * Infografis create request payload
 */
export interface CreateInfografisRequest {
  nama: string;
  url?: string;
  status: "1" | "0";
  isi?: string;
  foto: File | string;
}

/**
 * Infografis update request payload
 */
export interface UpdateInfografisRequest {
  nama?: string;
  url?: string;
  status?: "1" | "0";
  isi?: string;
  foto?: File | string;
}

/**
 * Infografis query parameters for listing
 */
export interface InfografisQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Infografis detail response interface
 */
export type InfografisDetailResponse = Infografis;
