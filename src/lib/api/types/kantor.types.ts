import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

export interface Kantor extends BaseEntity {
  nama: string;
  alamat?: string | null;
  lat: string;
  long: string;
  deskripsi?: string | null;
  radius_limit: number;
  jam_masuk: string;
  jam_pulang: string;
  jumlah_pegawai?: number;
}

export type KantorListResponse = PaginatedPayload<Kantor>;
