import type { ApiResponse, PaginationMeta } from "./apiResponse";
import httpInstance from "./httpInstance";

export interface VideoData {
  id: number;
  judul: string;
  isi: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface DokumenData {
  id: number;
  nama: string;
  file: string;
  isi?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type VideoDataPlayload<P = VideoData> = {
  videos: P[];
  meta?: PaginationMeta;
};

export type DokumenDataPlayload<P = DokumenData> = {
  dokumens: P[];
  meta?: PaginationMeta;
};

export type VideoResponse = ApiResponse<VideoDataPlayload<VideoData>>;
export type DokumenResponse = ApiResponse<DokumenDataPlayload<DokumenData>>;

export const getVideos = async (page: number = 1): Promise<VideoResponse> => {
  const response = await httpInstance.get<VideoResponse>(`/media/video`, {
    params: {
      page,
    },
  });
  return response.data;
};

export const getDokumens = async (page: number = 1): Promise<DokumenResponse> => {
  const response = await httpInstance.get<DokumenResponse>(`/media/dokumen`, {
    params: {
      page,
    },
  });
  return response.data;
};
