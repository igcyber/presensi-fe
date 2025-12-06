import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

export interface Pegawai extends BaseEntity {
  userId: number;
  tipePegawaiId: number;
  kantorId: number;
  nama: string;
  checkRadius: "YA" | "TIDAK";
  lat: string;
  long: string;
  user?: {
    id: number;
    email: string;
    username: string;
    noHp?: string;
  };
}

export type PegawaiListResponse = PaginatedPayload<Pegawai>;

export interface CreatePegawaiRequest {
  tipe_pegawai_id: number;
  kantor_id: number;
  nama: string;
  check_radius: "YA" | "TIDAK";
  lat: string;
  long: string;
  no_hp: string;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface UpdatePegawaiRequest {
  tipe_pegawai_id?: number;
  kantor_id?: number;
  nama?: string;
  check_radius?: "YA" | "TIDAK";
  lat?: string;
  long?: string;
  no_hp?: string;
  email?: string;
  username?: string;
  password?: string;
}

export interface PegawaiQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  type?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

