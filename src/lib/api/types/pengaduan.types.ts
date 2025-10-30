import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { TindakLanjut } from "./tindakLanjut.types";

/**
 * Pengaduan entity interface
 * Represents a complaint/pengaduan in the system
 */
export interface Pengaduan extends BaseEntity {
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  email: string;
  aduan: string;
  deskripsi: string;
  kategoriAduan?: string;
  status: "belum" | "diterima" | "selesai";
  keterangan?: string;
  isPublished?: number;
  isSelesai?: number | boolean;
  isPublic?: number | boolean;
  isPublicDprd?: number | boolean;
  tindakLanjuts?: TindakLanjut[];
}

/**
 * Pengaduan list response interface
 * Represents paginated pengaduan data from API
 */
export type PengaduanListResponse = PaginatedPayload<Pengaduan>;

/**
 * Pengaduan create request payload
 */
export interface CreatePengaduanRequest {
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  email: string;
  aduan: string;
  deskripsi: string;
  isPublished: boolean;
}

/**
 * Pengaduan update status request payload
 */
export interface UpdateStatusRequest {
  status: "belum" | "diterima";
  kategori_aduan?: string;
  keterangan?: string;
}

/**
 * Pengaduan update kategori request payload
 */
export interface UpdateKategoriRequest {
  kategori_aduan: string;
}

/**
 * Kategori pengaduan interface
 * Represents complaint categories
 */
export interface KategoriPengaduan {
  kategori_aduan: string;
}

/**
 * Pengaduan detail response interface
 */
export type PengaduanDetailResponse = Pengaduan;

/**
 * Pengaduan query parameters for listing
 */
export interface PengaduanQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  customFilters?: Array<Record<string, any>>;
}
