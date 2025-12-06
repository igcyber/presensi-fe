import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

export interface TipePegawai extends BaseEntity {
  nama: string;
}

export type TipePegawaiListResponse = PaginatedPayload<TipePegawai>;

