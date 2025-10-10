import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Statik entity interface
 * Represents static content in the system
 */
export interface Statik extends BaseEntity {
  nama: string;
  slug: string;
  isi: string;
  source: "file" | "link" | "text";
  kategori: string;
  attachment: string | null;
  icon?: string | null;
  fileUrl?: string | null;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
}

/**
 * Statik list response interface
 * Represents paginated statik data from API
 */
export type StatikListResponse = PaginatedPayload<Statik>;

/**
 * Statik create request payload
 */
export interface CreateStatikRequest {
  nama: string;
  isi?: string;
  source: "file" | "link" | "text";
  kategori: string;
  attachment?: File | string | null;
  icon?: string;
}

/**
 * Statik update request payload
 */
export interface UpdateStatikRequest {
  nama?: string;
  isi?: string;
  source?: "file" | "link" | "text";
  kategori?: string;
  attachment?: File | string | null;
  icon?: string;
}

/**
 * Statik query parameters for listing
 */
export interface StatikQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "nama" | "kategori" | "source" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Statik detail response interface
 */
export type StatikDetailResponse = Statik;

/**
 * Allowed source values for validation
 */
export const ALLOWED_SOURCES = ["file", "link", "text"] as const;

/**
 * Source options for form select
 */
export const SOURCE_OPTIONS = [
  { label: "File", value: "file" },
  { label: "Link", value: "link" },
  { label: "Text", value: "text" },
];

/**
 * Common kategori options for form select
 */
export const KATEGORI_OPTIONS = [
  { label: "Banner", value: "banner" },
  { label: "Social Media", value: "social-media" },
  { label: "Contact", value: "contact" },
  { label: "Logo", value: "logo" },
  { label: "Aplikasi", value: "aplikasi" },
  { label: "Custom", value: "custom" },
];
