import {
  type ApiResponse,
  type BaseEntity,
  type ContentData,
  type PaginationMeta,
  type PayloadData,
} from "@/lib/api/apiResponse";
import httpInstance from "@/lib/api/httpInstance";

// Content data type aliases for better semantic naming
export type SejarahData = ContentData;
export type KependudukanData = ContentData;
export type PotensiDaerahData = ContentData;
export type PrestasiPenghargaanContentData = ContentData;

/**
 * Achievement/Award data interface
 */
export interface Prestasi extends BaseEntity {
  tahun: string;
  tingkat: string;
  nama: string;
  keterangan: string;
}

/**
 * Achievement/Award data payload interface
 */
export interface PrestasiPenghargaanDataPayload {
  data: ContentData;
  prestasis?: Prestasi[];
  meta?: PaginationMeta;
}

// Response type aliases
export type SejarahResponse = ApiResponse<PayloadData<SejarahData>>;
export type KependudukanResponse = ApiResponse<PayloadData<KependudukanData>>;
export type PotensiDaerahResponse = ApiResponse<PayloadData<PotensiDaerahData>>;
export type PrestasiPenghargaanResponse = ApiResponse<PrestasiPenghargaanDataPayload>;

/**
 * Fetch history data
 * @returns Promise resolving to history response
 */
export const getSejarah = async (): Promise<SejarahResponse> => {
  const response = await httpInstance.get<SejarahResponse>("/selayang-pandang/sejarah");
  return response.data;
};

/**
 * Fetch population data
 * @returns Promise resolving to population response
 */
export const getKependudukan = async (): Promise<KependudukanResponse> => {
  const response = await httpInstance.get<KependudukanResponse>("/selayang-pandang/kependudukan");
  return response.data;
};

/**
 * Fetch regional potential data
 * @returns Promise resolving to regional potential response
 */
export const getPotensiDaerah = async (): Promise<PotensiDaerahResponse> => {
  const response = await httpInstance.get<PotensiDaerahResponse>("/selayang-pandang/potensi-daerah");
  return response.data;
};

/**
 * Fetch achievements and awards data
 * @param page - Page number
 * @returns Promise resolving to achievements and awards response
 */
export const getPrestasiPenghargaan = async (page: number): Promise<PrestasiPenghargaanResponse> => {
  const response = await httpInstance.get<PrestasiPenghargaanResponse>("/selayang-pandang/prestasi-dan-penghargaan", {
    params: { page },
  });
  return response.data;
};
