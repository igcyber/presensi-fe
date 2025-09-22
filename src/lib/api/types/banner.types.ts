import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Banner entity interface
 * Represents banner in the system
 */
export interface Banner extends BaseEntity {
  nama: string;
  foto: string;
  url?: string;
  status: "active" | "inactive";
  isi?: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
  fileUrl: string;
  fotoUrl: string;
}

/**
 * Banner list response interface
 * Represents paginated banner data from API
 */
export type BannerListResponse = PaginatedPayload<Banner>;

/**
 * Banner list public response interface
 * Represents paginated banner data from API
 */
export type BannerListPublicResponse = PaginatedPayload<Omit<Banner, "createdByUser,updatedByUser">>;

/**
 * Banner create request payload
 */
export interface CreateBannerRequest {
  nama: string;
  url?: string;
  status: "active" | "inactive";
  isi?: string;
  foto: File | string;
}

/**
 * Banner update request payload
 */
export interface UpdateBannerRequest {
  nama?: string;
  url?: string;
  status?: "active" | "inactive";
  isi?: string;
  foto?: File | string;
}

/**
 * Banner query parameters for listing
 */
export interface BannerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Banner detail response interface
 */
export type BannerDetailResponse = Banner;
