import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";
import type { User } from "@/lib/api/types/user.types";

/**
 * Radio entity interface
 * Represents radio content in the system
 */
export interface Radio extends BaseEntity {
  judul: string;
  isi?: string | null;
  link: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
}

/**
 * Radio list response interface
 * Represents paginated radio data from API
 */
export type RadioListResponse = PaginatedPayload<Radio>;

/**
 * Radio list public response interface
 * Represents paginated radio data from API
 */
export type RadioListPublicResponse = PaginatedPayload<Omit<Radio, "createdByUser,updatedByUser">>;

/**
 * Radio create request payload
 */
export interface CreateRadioRequest {
  judul: string;
  isi?: string;
  link: string;
}

/**
 * Radio update request payload
 */
export interface UpdateRadioRequest {
  judul?: string;
  isi?: string;
  link?: string;
}

/**
 * Radio query parameters for listing
 */
export interface RadioQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "judul" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Radio detail response interface
 */
export type RadioDetailResponse = Radio;
