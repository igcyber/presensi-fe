import type { BaseEntity, PaginationMeta } from "@/lib/api/core/apiResponse";

/**
 * Foto/Photo data interface
 */
export interface FotoData extends BaseEntity {
  judul: string;
  foto: string;
  description?: string;
  category?: string;
  tags?: string[];
}

/**
 * Video data interface
 */
export interface VideoData extends BaseEntity {
  judul: string;
  isi?: string | null;
  link: string;
  thumbnail?: string;
  duration?: number;
  category?: string;
}

/**
 * Radio data interface (extends VideoData)
 */
export interface RadioData extends BaseEntity {
  judul: string;
  isi?: string | null;
  link: string;
  thumbnail?: string;
  duration?: number;
  frequency?: string;
  schedule?: string;
}

/**
 * Document data interface
 */
export interface DokumenData extends BaseEntity {
  nama: string;
  file: string;
  isi?: string | null;
  fileSize?: number;
  fileType?: string;
  category?: string;
}

/**
 * Infographic data interface
 */
export interface InfografisData extends BaseEntity {
  nama: string;
  foto: string;
  url: string;
  status: string;
  isi?: string | null;
  category?: string;
  tags?: string[];
}

/**
 * Magazine data interface
 */
export interface MajalahData extends BaseEntity {
  link: string;
  bulan: number;
  tahun: number;
  cover?: string;
  title?: string;
  description?: string;
}

/**
 * List payload interfaces
 */
export interface FotoListPayload {
  fotos: FotoData[];
  meta?: PaginationMeta;
}

export interface VideoListPayload {
  videos: VideoData[];
  meta?: PaginationMeta;
}

export interface RadioListPayload {
  radios: RadioData[];
  meta?: PaginationMeta;
}

export interface DokumenListPayload {
  dokumens: DokumenData[];
  meta?: PaginationMeta;
}

export interface InfografisListPayload {
  infografis: InfografisData[];
  meta?: PaginationMeta;
}

export interface MajalahListPayload {
  majalahs: MajalahData[];
  meta?: PaginationMeta;
}

/**
 * Media search parameters
 */
export interface MediaSearchParams {
  page?: number;
  keyword?: string;
  category?: string;
  type?: "foto" | "video" | "radio" | "dokumen" | "infografis" | "majalah";
  sort?: "latest" | "popular" | "name";
}

/**
 * Create media request interfaces
 */
export interface CreateFotoRequest {
  judul: string;
  foto: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface CreateVideoRequest {
  judul: string;
  isi?: string;
  link: string;
  thumbnail?: string;
  duration?: number;
  category?: string;
}

export interface CreateDokumenRequest {
  nama: string;
  file: string;
  isi?: string;
  category?: string;
}

export interface CreateInfografisRequest {
  nama: string;
  foto: string;
  url: string;
  status: string;
  isi?: string;
  category?: string;
  tags?: string[];
}
