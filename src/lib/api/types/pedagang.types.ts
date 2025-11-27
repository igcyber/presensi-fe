import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

/**
 * Pedagang entity interface
 * Represents a pedagang (trader) in the system
 */
export interface Pedagang extends BaseEntity {
  nama: string;
  nik: string;
  noKk: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
}

/**
 * Pedagang detail response interface
 * Includes additional fields like pedagangHasKios
 */
export interface PedagangDetail extends Pedagang {
  pedagangHasKios: unknown[];
}

/**
 * Pedagang list response interface
 * Represents paginated pedagang data from API
 */
export type PedagangListResponse = PaginatedPayload<Pedagang>;

/**
 * Pedagang create request payload
 */
export interface CreatePedagangRequest {
  nama: string;
  nik: string;
  noKk: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
}

/**
 * Pedagang update request payload
 */
export interface UpdatePedagangRequest {
  nama?: string;
  nik?: string;
  noKk?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  alamat?: string;
}

/**
 * Pedagang query parameters for listing
 */
export interface PedagangQueryParams {
  page?: number;
  perPage?: number;
  per_page?: number;
  search?: string;
  sort_by?: "nama" | "nik" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Pedagang Kios entity interface
 * Represents the relationship between pedagang and kios
 */
export interface PedagangKios {
  id: number;
  pedagangId: number;
  kiosId: number;
  isActive: boolean;
  kios?: {
    id: number;
    kode: string;
    jenisUsahaId: number;
    pasarId: number;
    jenisUsaha?: {
      id: number;
      nama: string;
    };
    pasar?: {
      id: number;
      nama: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create pedagang kios request payload
 */
export interface CreatePedagangKiosRequest {
  kiosId: number;
  isActive: boolean;
}
