import {
  type ApiResponse,
  type BaseEntity,
  type ContentData,
  type PaginationMeta,
  type PayloadData,
} from "@/lib/api/apiResponse";
import httpInstance from "@/lib/api/httpInstance";

/**
 * Unit Kerja data structure
 */
export interface Opd extends BaseEntity {
  nama: string;
  alamat: string;
  maps: string;
  keterangan: string;
  foto: string;
  website: string;
}

export interface Layanan extends BaseEntity {
  logo: string;
  nama: string;
  jenis: string;
  alamat: string;
  keterangan: string;
}

export interface OpdDetail extends Opd {
  layanans: Layanan[];
}

export interface PerusahaanDaerah extends BaseEntity {
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  maps: string;
  foto: string;
}

/**
 * Unit Kerja list payload
 */
export interface OpdListPayload {
  data: ContentData;
  opds: Opd[];
  meta?: PaginationMeta;
}

export interface PerusahaanDaerahListPayload {
  data: ContentData;
  perusdas: PerusahaanDaerah[];
  meta?: PaginationMeta;
}

/**
 * Unit Kerja response
 */
export type OpdResponse = ApiResponse<OpdListPayload>;
export type OpdDetailResponse = ApiResponse<PayloadData<OpdDetail>>;
export type PerusahaanDaerahResponse = ApiResponse<PerusahaanDaerahListPayload>;

/**
 * Get unit kerja
 * @param page - Page number
 * @returns Promise resolving to unit kerja response
 */
export const getOpd = async (page: number): Promise<OpdResponse> => {
  const response = await httpInstance.get<OpdResponse>("/opd", {
    params: {
      page,
    },
  });
  return response.data;
};

/**
 * Get unit kerja by ID
 * @param id - Unit kerja ID
 * @returns Promise resolving to unit kerja by ID response
 */
export const getOpdDetail = async (id: number): Promise<OpdDetailResponse> => {
  const response = await httpInstance.get<OpdDetailResponse>(`/opd/${id}`);
  return response.data;
};

/**
 * Get perusahaan daerah
 * @param page - Page number
 * @returns Promise resolving to perusahaan daerah response
 */
export const getPerusahaanDaerah = async (page: number): Promise<PerusahaanDaerahResponse> => {
  const response = await httpInstance.get<PerusahaanDaerahResponse>("/perusda", {
    params: {
      page,
    },
  });
  return response.data;
};
