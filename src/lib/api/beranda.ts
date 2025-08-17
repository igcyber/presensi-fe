import { type ApiResponse } from "@/lib/api/apiResponse";

import httpInstance from "./httpInstance";

/**
 * Emergency/Hotline item interface
 */
export interface EmergencyItem {
  icon: string;
  nama: string;
  isi: string;
}

/**
 * News item interface
 */
export interface NewsItem {
  id: number;
  judul: string;
  foto: string;
  createdAt: Date;
  isi: string;
}

/**
 * Banner/Infographic item interface
 */
export interface BannerItem {
  foto: string;
  nama: string;
  createdAt: Date;
}

/**
 * Video item interface
 */
export interface VideoItem {
  id: number;
  judul: string;
  link: string;
  createdAt: Date;
  isi: string;
}

/**
 * Service item interface
 */
export interface LayananItem {
  logo: string;
  alamat: string;
  nama: string;
}

/**
 * System item interface
 */
export interface SistemItem {
  logo: string;
  alamat: string;
  nama: string;
}

/**
 * OPD (Regional Office) item interface
 */
export interface OpdItem {
  id: number;
  nama: string;
  foto: string;
  website: string;
  alamat: string;
}

/**
 * Homepage data interface
 */
export interface BerandaData {
  emergencies: EmergencyItem[];
  berita: NewsItem[];
  banners: BannerItem[];
  videos: VideoItem[];
  layanans: LayananItem[];
  sistems: SistemItem[];
  opds: OpdItem[];
}

export type BerandaResponse = ApiResponse<BerandaData>;

/**
 * Fetch homepage data
 * @returns Promise resolving to homepage response
 */
export const getBeranda = async (): Promise<BerandaResponse> => {
  const response = await httpInstance.get<BerandaResponse>("/beranda");
  return response.data;
};
