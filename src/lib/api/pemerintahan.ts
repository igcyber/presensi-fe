import { type ApiResponse, type ContentData, type PaginationMeta, type PlayloadData } from "@/lib/api/apiResponse";
import httpInstance from "@/lib/api/httpInstance";

export type TugasFungsiData = ContentData;
export type StrukturOrganisasiData = ContentData;
export type PotensiDaerahData = ContentData;
export type StrategiDaerahData = ContentData;
export type ProgramStrategisData = ContentData;
export type BupatiData = ContentData;
export type VisiMisiData = {
  visi: ContentData;
  misi: ContentData;
};

export interface Bupati {
  id: number;
  namaBupati: string;
  namaWakil: string;
  foto: string;
  tahunAwal: number;
  tahunAkhir: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransparansiKeuangan {
  id: number;
  nama: string;
  file: string;
  keterangan: string;
  tanggalPublikasi: string;
  createdAt: string;
  updatedAt: string;
}

export type BupatiDataPlayload<P = Bupati> = {
  data: ContentData;
  bupati?: P[];
};

export type TransparansiKeuanganDataPlayload<P = TransparansiKeuangan> = {
  dokumenkeuangans: P[];
  meta?: PaginationMeta;
};

export type TugasFungsiResponse = ApiResponse<PlayloadData<TugasFungsiData>>;
export type StrukturOrganisasiResponse = ApiResponse<PlayloadData<StrukturOrganisasiData>>;
export type VisiMisiResponse = ApiResponse<VisiMisiData>;
export type StrategiDaerahResponse = ApiResponse<PlayloadData<StrategiDaerahData>>;
export type ProgramStrategisResponse = ApiResponse<PlayloadData<ProgramStrategisData>>;
export type BupatiResponse = ApiResponse<BupatiDataPlayload<Bupati>>;
export type TransparansiKeuanganResponse = ApiResponse<TransparansiKeuanganDataPlayload<TransparansiKeuangan>>;

export const getTugasFungsi = async (): Promise<TugasFungsiResponse> => {
  const response = await httpInstance.get<TugasFungsiResponse>(`/pemerintahan/tugas-dan-fungsi`);
  return response.data;
};

export const getStrukturOrganisasi = async (): Promise<StrukturOrganisasiResponse> => {
  const response = await httpInstance.get<StrukturOrganisasiResponse>(`/pemerintahan/struktur-organisasi`);
  return response.data;
};

export const getVisiMisi = async (): Promise<VisiMisiResponse> => {
  const response = await httpInstance.get<VisiMisiResponse>(`/pemerintahan/visimisi`);
  return response.data;
};

export const getStrategiDaerah = async (): Promise<StrategiDaerahResponse> => {
  const response = await httpInstance.get<StrategiDaerahResponse>(`/pemerintahan/strategi`);
  return response.data;
};

export const getProgramStrategis = async (): Promise<ProgramStrategisResponse> => {
  const response = await httpInstance.get<ProgramStrategisResponse>(`/pemerintahan/program`);
  return response.data;
};

export const getBupati = async (): Promise<BupatiResponse> => {
  const response = await httpInstance.get<BupatiResponse>(`/pemerintahan/bupati`);
  return response.data;
};

export const getTransparansiKeuangan = async (page: number): Promise<TransparansiKeuanganResponse> => {
  const response = await httpInstance.get<TransparansiKeuanganResponse>(`/pemerintahan/transparansi-keuangan`, {
    params: {
      page,
    },
  });

  return response.data;
};
