import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Rapat entity interface
 * Represents a meeting/rapat in the system
 */
export interface Rapat extends BaseEntity {
  judul: string;
  lokasi: string | null;
  isi: string | null;
  tanggal: string;
  waktuMulai: string | null;
  waktuBerakhir: string | null;
  createdByUser: User;
  updatedByUser: User | null;
}

/**
 * Rapat list response interface
 * Represents paginated rapat data from API
 */
export type RapatListResponse = PaginatedPayload<Rapat>;

/**
 * Rapat create request payload
 */
export interface CreateRapatRequest {
  judul: string;
  lokasi?: string;
  isi?: string;
  tanggal: string | Date;
  waktuMulai?: string;
  waktuBerakhir?: string;
}

/**
 * Rapat update request payload
 */
export interface UpdateRapatRequest {
  judul?: string;
  lokasi?: string;
  isi?: string;
  tanggal?: string | Date;
  waktuMulai?: string;
  waktuBerakhir?: string;
}

/**
 * Rapat query parameters for listing
 */
export interface RapatQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "judul" | "lokasi" | "tanggal" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Rapat detail response interface
 */
export type RapatDetailResponse = Rapat;
