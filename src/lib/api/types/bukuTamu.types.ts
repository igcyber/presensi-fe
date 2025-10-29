import type { BaseEntity, PaginatedPayload } from "@/lib/api/core";

/**
 * Buku Tamu entity interface
 * Represents a guest book in the system
 */
export interface BukuTamu extends BaseEntity {
  judul: string;
  nama: string;
  nohp?: string | null;
  asal?: string | null;
  tujuan?: string | null;
  jumlahTamu?: number | null;
  perihal?: string | null;
  dokumen?: string | null;
  isRegistered?: number | boolean;
  createdBy: number;
  updatedBy: number;
  fileUrl?: string | null;
  link?: string | null;
}

/**
 * Buku Tamu list response interface
 * Represents paginated buku tamu data from API
 */
export type BukuTamuListResponse = PaginatedPayload<BukuTamu>;

/**
 * Buku Tamu detail response interface
 * Represents the detail of a buku tamu
 */
export type BukuTamuDetailResponse = BukuTamu;

/**
 * Buku Tamu create request interface
 * Represents the request payload for creating a new buku tamu
 */
export interface CreateBukuTamuRequest {
  judul: string;
}

/**
 * Buku Tamu create public request interface
 * Represents the request payload for creating a new buku tamu public
 */
export interface CreateBukuTamuPublicRequest {
  nama?: string;
  nohp?: string;
  asal?: string;
  tujuan?: string;
  jumlah_tamu?: number;
  perihal?: string;
  dokumen?: File | null;
}

/**
 * Buku Tamu query parameters for listing
 */
export interface BukuTamuQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "judul" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}
