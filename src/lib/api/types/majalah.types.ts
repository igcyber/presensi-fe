import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Majalah entity interface
 * Represents a magazine in the system
 */
export interface Majalah extends BaseEntity {
  link: string;
  bulan: number;
  tahun: number;
  createdBy: number;
  updatedBy: number;
  creator: Omit<User, "nip,roles">;
  updater: Omit<User, "nip,roles">;
  linkUrl?: string; // URL lengkap untuk mengakses file
}

/**
 * Majalah list response interface
 * Represents paginated majalah data from API
 */
export type MajalahListResponse = PaginatedPayload<Majalah>;

/**
 * Majalah create request payload
 */
export interface CreateMajalahRequest {
  link?: File | string;
  bulan: number;
  tahun: number;
}

/**
 * Majalah update request payload
 */
export interface UpdateMajalahRequest {
  link?: File | string;
  bulan?: number;
  tahun?: number;
}

/**
 * Majalah query parameters for listing
 */
export interface MajalahQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  bulan?: number;
  tahun?: number;
  sort_by?: "bulan" | "tahun" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Majalah detail response interface
 */
export type MajalahDetailResponse = Majalah;

/**
 * Month options for select
 */
export const MONTH_OPTIONS = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];

/**
 * Year options generator
 */
export const generateYearOptions = (startYear: number = 2020, endYear?: number) => {
  const currentYear = new Date().getFullYear();
  const finalEndYear = endYear || currentYear + 5;
  const years = [];

  for (let year = finalEndYear; year >= startYear; year--) {
    years.push({ label: year.toString(), value: year });
  }

  return years;
};
