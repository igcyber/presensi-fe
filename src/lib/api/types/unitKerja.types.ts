import type { BaseEntity, ContentData, PaginationMeta } from "@/lib/api/core/apiResponse";

import type { Opd } from "./opd.types";

/**
 * Layanan (Service) data structure
 */
export interface Layanan extends BaseEntity {
  logo: string;
  nama: string;
  jenis: string;
  alamat: string;
  keterangan: string;
  website?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

/**
 * OPD detail with related data
 */
export interface OpdDetail extends Opd {
  layanans: Layanan[];
  struktur?: {
    kepala: string;
    sekretaris: string;
    bendahara: string;
  };
}

/**
 * Layanan detail with related data
 */
export interface LayananDetail extends Layanan {
  opd: {
    id: number;
    nama: string;
    alamat: string;
  };
  prosedur?: string;
  persyaratan?: string;
  biaya?: string;
}

/**
 * OPD list payload interface
 */
export interface OpdListPayload {
  data: ContentData;
  opds: Opd[];
  meta?: PaginationMeta;
}

/**
 * Layanan list payload interface
 */
export interface LayananListPayload {
  data: ContentData;
  layanans: Layanan[];
  meta?: PaginationMeta;
}

/**
 * Search parameters for Layanan
 */
export interface LayananSearchParams {
  page?: number;
  keyword?: string;
  jenis?: string;
  opdId?: number;
  sort?: "nama" | "latest" | "jenis";
}

/**
 * Create Layanan request
 */
export interface CreateLayananRequest {
  logo: string;
  nama: string;
  jenis: string;
  alamat: string;
  keterangan: string;
  website?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

/**
 * Update Layanan request
 */
export interface UpdateLayananRequest {
  logo?: string;
  nama?: string;
  jenis?: string;
  alamat?: string;
  keterangan?: string;
  website?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}
