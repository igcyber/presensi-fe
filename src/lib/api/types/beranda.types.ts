import type { BaseEntity } from "@/lib/api/core/apiResponse";

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
export interface NewsItem extends BaseEntity {
  judul: string;
  foto: string;
  isi: string;
}

/**
 * Banner/Infographic item interface
 */
export interface BannerItem extends BaseEntity {
  foto: string;
  nama: string;
}

/**
 * Video item interface
 */
export interface VideoItem extends BaseEntity {
  judul: string;
  link: string;
  isi: string;
}

/**
 * Service item interface
 */
export interface LayananItem extends BaseEntity {
  logo: string;
  alamat: string;
  nama: string;
}

/**
 * System item interface
 */
export interface SistemItem extends BaseEntity {
  logo: string;
  alamat: string;
  nama: string;
}

/**
 * OPD (Regional Office) item interface
 */
export interface OpdItem extends BaseEntity {
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
