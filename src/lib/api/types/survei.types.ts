import type { BaseEntity, PayloadDataExternal } from "@/lib/api/core/apiResponse";

/**
 * Layanan Survei entity interface
 */
export interface LayananSurvei extends BaseEntity {
  id: number;
  perangkat_daerah: string;
  perangkat_daerah_id: number;
  perangkat_daerah_unit: string;
  perangkat_daerah_unit_id: number;
  nama: string;
  slug: string;
  total_responden: number;
  indeks: string;
  mutu: string;
  class_name: string;
}

/**
 * Pilihan Jawaban interface
 */
export interface PilihanJawaban {
  id: number;
  label: string;
  nilai: number;
}

/**
 * Kuesioner interface
 */
export interface Kuesioner extends BaseEntity {
  id: number;
  kategori: string;
  pertanyaan: string;
  pilihan: PilihanJawaban[];
}

/**
 * Data Responden interface
 */
export interface DataResponden {
  nama: string;
  hp: string;
  jenis_kelamin: "L" | "P";
  usia: number;
  pendidikan: string;
  pekerjaan: string;
}

/**
 * Jawaban Survei interface
 */
export interface JawabanSurvei {
  pertanyaan_id: number;
  jawaban_id: number;
}

/**
 * Submit Survei Request interface
 */
export interface SubmitSurveiRequest {
  pelayanan_id: number;
  responden: DataResponden;
  survei: JawabanSurvei[];
  masukkan?: string;
}

/**
 * Layanan Survei list response interface
 */
export type LayananSurveiListResponse = PayloadDataExternal<LayananSurvei>;

/**
 * Kuesioner list response interface
 */
export type KuesionerListResponse = PayloadDataExternal<Kuesioner>;

/**
 * Submit Survei response interface
 */
export interface SubmitSurveiResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    cooldown_until: string;
  };
}

/**
 * Cooldown status interface
 */
export interface CooldownStatus {
  isOnCooldown: boolean;
  remainingTime: number; // in seconds
  cooldownUntil?: string;
}

/**
 * Survei query parameters
 */
export interface SurveiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  perangkat_daerah_id?: number;
  perangkat_daerah_unit_id?: number;
}

/**
 * Pendidikan options
 */
export const PENDIDIKAN_OPTIONS = [
  { label: "SD", value: "sd" },
  { label: "SMP", value: "smp" },
  { label: "SMA/SMK", value: "sma" },
  { label: "DIPLOMA", value: "diploma" },
  { label: "S1", value: "s1" },
  { label: "S2", value: "s2" },
  { label: "S3", value: "s3" },
];

/**
 * Jenis Kelamin options
 */
export const JENIS_KELAMIN_OPTIONS = [
  { label: "Laki-laki", value: "L" },
  { label: "Perempuan", value: "P" },
];
