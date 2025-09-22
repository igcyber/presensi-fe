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
  jenis: "video" | "file" | "emergency" | "operasional" | "alamat" | "email" | "telepon";
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
  jenis: "video" | "file" | "emergency" | "operasional" | "alamat" | "email" | "telepon";
  icon?: string;
  isiText?: string;
  isiFile?: File | string;
}

/**
 * Statik update request payload
 */
export interface UpdateStatikRequest {
  nama?: string;
  jenis?: "video" | "file" | "emergency" | "operasional" | "alamat" | "email" | "telepon";
  icon?: string;
  isiText?: string;
  isiFile?: File | string;
}

/**
 * Statik query parameters for listing
 */
export interface StatikQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "nama" | "jenis" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Statik detail response interface
 */
export type StatikDetailResponse = Statik;

/**
 * Allowed jenis values for validation
 */
export const ALLOWED_JENIS = ["video", "file", "emergency", "operasional", "alamat", "email", "telepon"] as const;

/**
 * Jenis options for form select
 */
export const JENIS_OPTIONS = [
  { label: "Video", value: "video" },
  { label: "File", value: "file" },
  { label: "Emergency", value: "emergency" },
  { label: "Operasional", value: "operasional" },
  { label: "Alamat", value: "alamat" },
  { label: "Email", value: "email" },
  { label: "Telepon", value: "telepon" },
];
