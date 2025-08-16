import type { ApiResponse, PaginationMeta } from "./apiResponse";
import httpInstance from "./httpInstance";

// Video data interface
export interface VideoData {
  id: number;
  judul: string;
  isi: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export type VideoDataPlayload<P = VideoData> = {
  videos: P[];
  meta?: PaginationMeta;
};

// Video API response interface
export type VideoResponse = ApiResponse<VideoDataPlayload<VideoData>>;

// API function to get videos
export const getVideos = async (page: number = 1): Promise<VideoResponse> => {
  const response = await httpInstance.get<VideoResponse>(`/media/video`, {
    params: {
      page,
    },
  });
  return response.data;
};
