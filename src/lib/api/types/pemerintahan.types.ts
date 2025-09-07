import type { BaseEntity, ContentData, PaginationMeta } from "../core/apiResponse";

/**
 * Content data type aliases for better semantic naming
 */
export type TugasFungsiData = ContentData;
export type StrukturOrganisasiData = ContentData;
export type StrategiDaerahData = ContentData;
export type ProgramStrategisData = ContentData;
export type BupatiContentData = ContentData;

/**
 * Vision and Mission data structure
 */
export interface VisiMisiData {
  visi: ContentData;
  misi: ContentData;
}

/**
 * Regent (Bupati) data interface
 */
export interface Bupati extends BaseEntity {
  namaBupati: string;
  namaWakil: string;
  foto: string;
  tahunAwal: number;
  tahunAkhir: number;
  periode?: string;
  biografi?: string;
}

/**
 * Financial transparency document interface
 */
export interface TransparansiKeuangan extends BaseEntity {
  nama: string;
  file: string;
  link?: string | null;
  keterangan: string;
  tanggalPublikasi: string;
  category?: string;
  fileSize?: number;
}

/**
 * Regent data payload interface
 */
export interface BupatiPayload {
  data: ContentData;
  bupati: Bupati[];
}

/**
 * Vision and Mission payload interface
 */
export interface VisiMisiPayload {
  visiMisi: VisiMisiData;
}

/**
 * Financial transparency list payload interface
 */
export interface TransparansiKeuanganListPayload {
  dokumenkeuangans: TransparansiKeuangan[];
  meta?: PaginationMeta;
}

/**
 * Content data payload interface
 */
export interface ContentDataPayload {
  content: ContentData;
}

/**
 * Search parameters for financial transparency
 */
export interface TransparansiSearchParams {
  page?: number;
  keyword?: string;
  category?: string;
  year?: number;
  sort?: "latest" | "name" | "date";
}

/**
 * Create financial transparency request
 */
export interface CreateTransparansiRequest {
  nama: string;
  file: string;
  link?: string;
  keterangan: string;
  tanggalPublikasi: string;
  category?: string;
}

/**
 * Update financial transparency request
 */
export interface UpdateTransparansiRequest {
  nama?: string;
  file?: string;
  link?: string;
  keterangan?: string;
  tanggalPublikasi?: string;
  category?: string;
}
