import httpInstance from "@/lib/api/httpInstance";

export interface ContentData {
  id: number;
  nama: string;
  isi: string;
  slug: string;
  foto: string;
  createdAt: string;
  updatedAt: string;
}

export type SejarahData = ContentData;
export type KependudukanData = ContentData;
export type PotensiDaerahData = ContentData;
export type PrestasiPenghargaanData = ContentData;

export interface PageMeta {
  pagers: string[];
  position: string;
  pagetitle: string;
}

export interface Prestasi {
  id: number;
  tahun: string;
  tingkat: string;
  nama: string;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export type ApiResponse<T, M = PageMeta, P = Prestasi> = {
  status?: string;
  data: { data: T } & M;
  prestasis?: P[];
};

export type SejarahResponse = ApiResponse<SejarahData>;
export type KependudukanResponse = ApiResponse<KependudukanData>;
export type PotensiDaerahResponse = ApiResponse<PotensiDaerahData>;
export type PrestasiPenghargaanResponse = ApiResponse<PrestasiPenghargaanData, PageMeta, Prestasi>;

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
