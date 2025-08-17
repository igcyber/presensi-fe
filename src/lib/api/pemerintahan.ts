import {
  type ApiResponse,
  type BaseEntity,
  type ContentData,
  type PaginationMeta,
  type PayloadData,
} from "@/lib/api/apiResponse";
import httpInstance from "@/lib/api/httpInstance";

// Content data type aliases for better semantic naming
export type TugasFungsiData = ContentData;
export type StrukturOrganisasiData = ContentData;
export type PotensiDaerahData = ContentData;
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
}

/**
 * Financial transparency document interface
 */
export interface TransparansiKeuangan extends BaseEntity {
  nama: string;
  file: string;
  keterangan: string;
  tanggalPublikasi: string;
}

/**
 * Regent data payload interface
 */
export interface BupatiDataPayload {
  data: ContentData;
  bupati?: Bupati[];
}

/**
 * Financial transparency list payload interface
 */
export interface TransparansiKeuanganListPayload {
  dokumenkeuangans: TransparansiKeuangan[];
  meta?: PaginationMeta;
}

// Response type aliases
export type TugasFungsiResponse = ApiResponse<PayloadData<TugasFungsiData>>;
export type StrukturOrganisasiResponse = ApiResponse<PayloadData<StrukturOrganisasiData>>;
export type VisiMisiResponse = ApiResponse<VisiMisiData>;
export type StrategiDaerahResponse = ApiResponse<PayloadData<StrategiDaerahData>>;
export type ProgramStrategisResponse = ApiResponse<PayloadData<ProgramStrategisData>>;
export type BupatiResponse = ApiResponse<BupatiDataPayload>;
export type TransparansiKeuanganResponse = ApiResponse<TransparansiKeuanganListPayload>;

/**
 * Fetch duties and functions data
 * @returns Promise resolving to duties and functions response
 */
export const getTugasFungsi = async (): Promise<TugasFungsiResponse> => {
  const response = await httpInstance.get<TugasFungsiResponse>("/pemerintahan/tugas-dan-fungsi");
  return response.data;
};

/**
 * Fetch organizational structure data
 * @returns Promise resolving to organizational structure response
 */
export const getStrukturOrganisasi = async (): Promise<StrukturOrganisasiResponse> => {
  const response = await httpInstance.get<StrukturOrganisasiResponse>("/pemerintahan/struktur-organisasi");
  return response.data;
};

/**
 * Fetch vision and mission data
 * @returns Promise resolving to vision and mission response
 */
export const getVisiMisi = async (): Promise<VisiMisiResponse> => {
  const response = await httpInstance.get<VisiMisiResponse>("/pemerintahan/visimisi");
  return response.data;
};

/**
 * Fetch regional strategy data
 * @returns Promise resolving to regional strategy response
 */
export const getStrategiDaerah = async (): Promise<StrategiDaerahResponse> => {
  const response = await httpInstance.get<StrategiDaerahResponse>("/pemerintahan/strategi");
  return response.data;
};

/**
 * Fetch strategic programs data
 * @returns Promise resolving to strategic programs response
 */
export const getProgramStrategis = async (): Promise<ProgramStrategisResponse> => {
  const response = await httpInstance.get<ProgramStrategisResponse>("/pemerintahan/program");
  return response.data;
};

/**
 * Fetch regent (bupati) data
 * @returns Promise resolving to regent response
 */
export const getBupati = async (): Promise<BupatiResponse> => {
  const response = await httpInstance.get<BupatiResponse>("/pemerintahan/bupati");
  return response.data;
};

/**
 * Fetch financial transparency documents
 * @param page - Page number
 * @returns Promise resolving to financial transparency response
 */
export const getTransparansiKeuangan = async (page: number): Promise<TransparansiKeuanganResponse> => {
  const response = await httpInstance.get<TransparansiKeuanganResponse>("/pemerintahan/transparansi-keuangan", {
    params: { page },
  });
  return response.data;
};
