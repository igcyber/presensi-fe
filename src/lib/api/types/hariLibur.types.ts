import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

export interface HariLibur extends BaseEntity {
  tanggal: string;
  keterangan: string;
}

export type HariLiburListResponse = PaginatedPayload<HariLibur>;

export interface HariLiburQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  date?: string;
}

export interface CreateHariLiburRequest {
  tanggal: string;
  keterangan?: string;
}

export interface UpdateHariLiburRequest {
  tanggal?: string;
  keterangan?: string;
}
