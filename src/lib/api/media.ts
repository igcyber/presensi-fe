import { type ApiResponse, type BaseEntity, type PaginationMeta } from "@/lib/api/apiResponse";
import httpInstance from "@/lib/api/httpInstance";

/**
 * Infographic data interface
 */
export interface FotoData extends BaseEntity {
  judul: string;
  foto: string;
}

/**
 * Video data interface
 */
export interface VideoData extends BaseEntity {
  judul: string;
  isi?: string | null;
  link: string;
}

export type RadioData = VideoData;

/**
 * Document data interface
 */
export interface DokumenData extends BaseEntity {
  nama: string;
  file: string;
  isi?: string | null;
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
}

/**
 * Magazine data interface
 */
export interface MajalahData extends BaseEntity {
  link: string;
  bulan: number;
  tahun: number;
}

/**
 * Infographic list payload interface
 */
export interface FotoListPayload {
  fotos: FotoData[];
  meta?: PaginationMeta;
}

/**
 * Video list payload interface
 */
export interface VideoListPayload {
  videos: VideoData[];
  meta?: PaginationMeta;
}

/**
 * Radio list payload interface
 */
export interface RadioListPayload {
  radios: RadioData[];
  meta?: PaginationMeta;
}

/**
 * Document list payload interface
 */
export interface DokumenListPayload {
  dokumens: DokumenData[];
  meta?: PaginationMeta;
}

/**
 * Infographic list payload interface
 */
export interface InfografisListPayload {
  infografis: InfografisData[];
  meta?: PaginationMeta;
}

/**
 * Magazine list payload interface
 */
export interface MajalahListPayload {
  majalahs: MajalahData[];
  meta?: PaginationMeta;
}

// Response type aliases
export type FotoResponse = ApiResponse<FotoListPayload>;
export type VideoResponse = ApiResponse<VideoListPayload>;
export type RadioResponse = ApiResponse<RadioListPayload>;
export type DokumenResponse = ApiResponse<DokumenListPayload>;
export type InfografisResponse = ApiResponse<InfografisListPayload>;
export type MajalahResponse = ApiResponse<MajalahListPayload>;

/**
 * Fetch paginated fotos
 * @param page - Page number (defaults to 1)
 * @returns Promise resolving to foto response
 */
export const getFotos = async (page: number = 1): Promise<FotoResponse> => {
  const response = await httpInstance.get<FotoResponse>("/media/foto", {
    params: { page },
  });
  return response.data;
};

/**
 * Fetch paginated videos
 * @param page - Page number (defaults to 1)
 * @returns Promise resolving to video response
 */
export const getVideos = async (page: number = 1): Promise<VideoResponse> => {
  const response = await httpInstance.get<VideoResponse>("/media/video", {
    params: { page },
  });
  return response.data;
};

/**
 * Fetch paginated radios
 * @param page - Page number (defaults to 1)
 * @returns Promise resolving to radio response
 */
export const getRadios = async (page: number = 1): Promise<RadioResponse> => {
  const response = await httpInstance.get<RadioResponse>("/media/radio", {
    params: { page },
  });
  return response.data;
};

/**
 * Fetch paginated documents
 * @param page - Page number (defaults to 1)
 * @returns Promise resolving to document response
 */
export const getDokumens = async (page: number = 1): Promise<DokumenResponse> => {
  const response = await httpInstance.get<DokumenResponse>("/media/dokumen", {
    params: { page },
  });
  return response.data;
};

/**
 * Fetch paginated infographics
 * @param page - Page number (defaults to 1)
 * @returns Promise resolving to infographic response
 */
export const getInfografis = async (page: number = 1): Promise<InfografisResponse> => {
  const response = await httpInstance.get<InfografisResponse>("/media/infografis", {
    params: { page },
  });
  return response.data;
};

/**
 * Fetch paginated magazines
 * @param page - Page number (defaults to 1)
 * @returns Promise resolving to magazine response
 */
export const getMajalahs = async (page: number = 1): Promise<MajalahResponse> => {
  const response = await httpInstance.get<MajalahResponse>("/media/majalah", {
    params: { page },
  });
  return response.data;
};
