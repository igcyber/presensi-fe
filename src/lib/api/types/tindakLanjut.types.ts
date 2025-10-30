import type { BaseEntity, PaginatedPayload } from "@/lib/api/core";

/**
 * Tindak Lanjut entity interface
 * Represents a follow-up action for pengaduan
 */
export interface TindakLanjut extends BaseEntity {
  pengaduanId: number;
  tanggalMulai: string;
  tanggalTindakLanjut?: string | null;
  deskripsi: string;
  dokumenDukung?: string | null;
  dokumenDukungUrl?: string | null;
}

/**
 * Tindak Lanjut list response interface
 * Represents paginated tindak lanjut data from API
 */
export type TindakLanjutListResponse = PaginatedPayload<TindakLanjut>;

/**
 * Tindak Lanjut detail response interface
 * Represents the detail of a tindak lanjut
 */
export type TindakLanjutDetailResponse = TindakLanjut;

/**
 * Tindak Lanjut create request interface
 * Represents the request payload for creating a new tindak lanjut
 */
export interface CreateTindakLanjutRequest {
  pengaduanId: number;
  tanggalMulai: string;
  tanggalTindakLanjut?: string;
  deskripsi: string;
  dokumenDukung?: File | null;
}

/**
 * Tindak Lanjut update request interface
 * Represents the request payload for updating a tindak lanjut
 */
export interface UpdateTindakLanjutRequest {
  tanggalMulai?: string;
  tanggalTindakLanjut?: string;
  deskripsi?: string;
  dokumenDukung?: File | null;
}

/**
 * Tindak Lanjut query parameters for listing
 */
export interface TindakLanjutQueryParams {
  pengaduanId?: number;
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "tanggalMulai" | "tanggalTindakLanjut" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}
