import type { BaseEntity } from "@/lib/api/core/apiResponse";

export interface PresensiPayload {
  tipe: "MASUK" | "PULANG";
  lat: string;
  long: string;
  jarak: number;
  image: File;
}

export interface KantorData {
  id: number;
  nama: string;
  alamat: string;
  lat: string;
  long: string;
  radius_limit: number;
  except_user?: boolean;
  jam_masuk?: string;
  jam_pulang?: string;
}

/**
 * Response dari GET /api/pegawai/absen
 */
export interface PresensiStatusResponse {
  kantor: KantorData | null;
  riwayat: RiwayatPresensiHariIni[];
}

export interface RiwayatPresensiHariIni {
  id: number;
  pegawaiId: number;
  hariLiburId: number | null;
  tipe: "MASUK" | "PULANG" | "MASUK_LEMBUR" | "PULANG_LEMBUR";
  tanggalAbsen: string;
  lat: string;
  long: string;
  akurasi: number;
  foto: string;
  fotoUrl: string;
}

/**
 * Response sukses setelah POST Absen
 */
export interface PresensiResponseData extends BaseEntity {
  tipe: string;
  lat: string;
  long: string;
  pegawaiId: number;
  foto: string;
  tanggalAbsen: string;
  akurasi: string;
  fotoUrl: string;
}

/**
 * Parameter untuk Request Rekap
 */
export interface RekapPresensiParams {
  tipe: "bulanan" | "range";
  month?: number;
  year?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Item Detail Presensi per Hari
 */
export interface DataPresensiItem {
  tipe: "MASUK" | "PULANG" | "MASUK_LEMBUR" | "PULANG_LEMBUR" | "IZIN" | "SAKIT" | "CUTI";
  jam: string;
  foto_url?: string;
  lat?: string;
  long?: string;
}

export interface RekapDetailItem {
  tanggal: string;
  status: string; // "Hadir", "Izin", "Libur", "Tanggal Merah", "Tanpa Keterangan"
  data_absen: DataPresensiItem[];
}

/**
 * Response GET /rekap-absen
 */
export interface RekapPresensiResponse {
  pegawai: {
    nama: string;
    tipe_pegawai: string;
  };
  periode: {
    awal: string;
    akhir: string;
  };
  // Hanlde object dengan key index string "0", "1", dst.
  detail: Record<string, RekapDetailItem>;
}

/**
 * Parameter untuk Get Riwayat Harian
 */
export interface RiwayatPresensiParams {
  date: string; // Format: YYYY-MM-DD
}

/**
 * Item Response Riwayat Absen
 */
export interface RiwayatPresensiItem {
  id: number;
  pegawaiId: number;
  foto: string;
  tipe: "MASUK" | "PULANG" | "MASUK_LEMBUR" | "PULANG_LEMBUR";
  tanggalAbsen: string;
  lat: string;
  long: string;
  akurasi: number;
}

/**
 * Tipe Permohonan
 */
export type TipePermohonan = "Sakit" | "Izin" | "Cuti";

/**
 * Parameter Filter Permohonan
 */
export interface PermohonanParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  tipe?: string;
  date?: string;
}

/**
 * Payload Create Permohonan (Multipart)
 */
export interface PermohonanPayload {
  tipe: TipePermohonan;
  tanggal_pengajuan: string; // YYYY-MM-DD
  keterangan_pengajuan: string;
  file_pendukung: File;
}

/**
 * Item Response Permohonan
 */
export interface PermohonanItem {
  id: number;
  pegawaiId: number;
  tipe: TipePermohonan;
  tanggalPengajuan: string;
  keteranganPengajuan: string;
  filePendukung: string;
  filePendukungUrl: string;
  status: string;
  verifikatorId?: number | null;
  tanggalVerifikator?: string | null;
  keteranganVerifikator?: string | null;
}

/**
 * Response List Permohonan (Paginated)
 */
export interface PermohonanListResponse {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
  data: PermohonanItem[];
}
