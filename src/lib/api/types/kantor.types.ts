import type { PaginatedPayload } from "@/lib/api/core/apiResponse";

export interface Kantor {
  id: number;
  nama: string;
  alamat: string;
  lat: string;
  long: string;
  deskripsi: string;
  radius_limit: number;
  jam_masuk: string;
  jam_pulang: string;
  jumlah_pegawai: number;
}

export type KantorListResponse = PaginatedPayload<Kantor>;

