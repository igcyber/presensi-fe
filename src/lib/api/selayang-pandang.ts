import { type ApiResponse, type ContentData, type PlayloadData } from "@/lib/api/apiResponse";
import httpInstance from "@/lib/api/httpInstance";

export type SejarahData = ContentData;
export type KependudukanData = ContentData;
export type PotensiDaerahData = ContentData;
export type PrestasiPenghargaanData = ContentData;

export interface Prestasi {
  id: number;
  tahun: string;
  tingkat: string;
  nama: string;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export type PrestasiPenghargaanDataPlayload<P = Prestasi> = {
  data: ContentData;
  prestasis?: P[];
};

export type SejarahResponse = ApiResponse<PlayloadData<SejarahData>>;
export type KependudukanResponse = ApiResponse<PlayloadData<KependudukanData>>;
export type PotensiDaerahResponse = ApiResponse<PlayloadData<PotensiDaerahData>>;
export type PrestasiPenghargaanResponse = ApiResponse<PrestasiPenghargaanDataPlayload<Prestasi>>;

export const getSejarah = async (): Promise<SejarahResponse> => {
  const response = await httpInstance.get<SejarahResponse>(`/selayang-pandang/sejarah`);
  return response.data;
};

export const getKependudukan = async (): Promise<KependudukanResponse> => {
  const response = await httpInstance.get<KependudukanResponse>(`/selayang-pandang/kependudukan`);
  return response.data;
};

export const getPotensiDaerah = async (): Promise<PotensiDaerahResponse> => {
  const response = await httpInstance.get<PotensiDaerahResponse>(`/selayang-pandang/potensi-daerah`);
  return response.data;
};

export const getPrestasiPenghargaan = async (): Promise<PrestasiPenghargaanResponse> => {
  const response = await httpInstance.get<PrestasiPenghargaanResponse>(`/selayang-pandang/prestasi-dan-penghargaan`);
  return response.data;
};
