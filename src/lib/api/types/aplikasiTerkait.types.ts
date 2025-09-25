import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Aplikasi Terkait entity interface
 * Represents related application in the system
 */
export interface AplikasiTerkait extends BaseEntity {
  cover: string;
  text: string;
  link: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
  coverUrl: string;
}

/**
 * Aplikasi Terkait list response interface
 * Represents paginated aplikasi terkait data from API
 */
export type AplikasiTerkaitListResponse = PaginatedPayload<AplikasiTerkait>;

/**
 * Aplikasi Terkait create request payload
 */
export interface CreateAplikasiTerkaitRequest {
  cover?: File | string;
  text: string;
  link: string;
}

/**
 * Aplikasi Terkait update request payload
 */
export interface UpdateAplikasiTerkaitRequest {
  cover?: File | string;
  text?: string;
  link?: string;
}

/**
 * Aplikasi Terkait query parameters for listing
 */
export interface AplikasiTerkaitQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "text" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Aplikasi Terkait detail response interface
 */
export type AplikasiTerkaitDetailResponse = AplikasiTerkait;
