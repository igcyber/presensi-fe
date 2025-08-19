import { type ApiResponse, type BaseEntity, type PaginationMeta, type PayloadData } from "@/lib/api/apiResponse";
import httpInstance from "@/lib/api/httpInstance";

// Berita data structure
export interface Berita extends BaseEntity {
  opdId: number;
  judul: string;
  isi: string;
  foto: string;
}

export interface BeritaDetail extends Berita {
  opd: {
    nama: string;
  };
}

export interface BeritaSidebar extends BaseEntity {
  judul: string;
  foto: string;
}

// Berita list payload
export interface BeritaListPayload {
  beritas: Berita[];
  meta?: PaginationMeta;
}

// Berita response
export type BeritaResponse = ApiResponse<BeritaListPayload>;
export type BeritaDetailResponse = ApiResponse<PayloadData<BeritaDetail>>;
export type BeritaSidebarResponse = ApiResponse<BeritaSidebar[]>;

// Get berita list
export const getBeritaList = async (page: number, keyword?: string): Promise<BeritaResponse> => {
  const response = await httpInstance.get<BeritaResponse>(
    `/berita?page=${page}${keyword ? `&keyword=${keyword}` : ""}`,
  );
  return response.data;
};

// Get berita detail
export const getBeritaDetail = async (id: number): Promise<BeritaDetailResponse> => {
  const response = await httpInstance.get<BeritaDetailResponse>(`/berita/${id}`);
  return response.data;
};

// Get berita sidebar
export const getBeritaSidebar = async (): Promise<BeritaSidebarResponse> => {
  const response = await httpInstance.get<BeritaSidebarResponse>(`/berita/sidebar`);
  return response.data;
};
