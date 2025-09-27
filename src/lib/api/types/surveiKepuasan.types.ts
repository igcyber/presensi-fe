import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

/**
 * Survei Kepuasan Masyarakat entity interface
 */
export interface SurveiKepuasan extends BaseEntity {
  nama: string;
  noHp: string;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
  usia: string;
  pendidikan: string;
  pekerjaan: string;
  surveyPayload: string;
  surveyResult: string;
}

/**
 * Parsed Survey Payload interface
 */
export interface ParsedSurveyPayload {
  pelayanan_id: number;
  responden: {
    nama: string;
    hp: string;
    jenis_kelamin: "L" | "P";
    usia: number;
    pendidikan: string;
    pekerjaan: string;
  };
  survei: Array<{
    pertanyaan_id: number;
    jawaban_id: number;
  }>;
  masukkan?: string;
}

/**
 * Parsed Survey Result interface
 */
export interface ParsedSurveyResult {
  success?: boolean;
  error?: boolean;
  message?: string;
  data?: any[];
  code?: number;
  timestamp?: string;
}

/**
 * Survei Kepuasan list response interface
 */
export type SurveiKepuasanListResponse = PaginatedPayload<SurveiKepuasan>;

/**
 * Survei Kepuasan detail response interface
 */
export type SurveiKepuasanDetailResponse = SurveiKepuasan;

/**
 * Survei Kepuasan query parameters
 */
export interface SurveiKepuasanQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Survey Status API Response interfaces
 */
export interface SurveyStatusResponse {
  authentication: {
    authenticated: boolean;
  };
  connectivity: boolean;
  userInfo: {
    success: boolean;
    data: SurveyQuestion[];
    message: string;
    code: number;
  };
}

/**
 * Survey Question interface
 */
export interface SurveyQuestion {
  id: number;
  kategori: string;
  pertanyaan: string;
  pilihan: SurveyOption[];
}

/**
 * Survey Option interface
 */
export interface SurveyOption {
  id: number;
  label: string;
  nilai: number;
}

/**
 * Mapped Survey Answer interface
 */
export interface MappedSurveyAnswer {
  pertanyaan: SurveyQuestion;
  jawaban: SurveyOption;
  pertanyaan_id: number;
  jawaban_id: number;
}
