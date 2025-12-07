import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

export interface Kantor extends BaseEntity {
  nama: string;
  alamat?: string | null;
  lat: string;
  long: string;
  deskripsi?: string | null;
  radiusLimit: number;
  jamMasuk: string;
  jamPulang: string;
  jumlah_pegawai?: number;
  exceptUser?: number[];
}

export type KantorListResponse = PaginatedPayload<Kantor>;
