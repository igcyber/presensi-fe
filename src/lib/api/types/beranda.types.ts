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
  fotoUrl: string;
}

/**
 * Banner/Infographic item interface
 */
export interface BannerItem extends BaseEntity {
  foto: string;
  nama: string;
  fileUrl: string;
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
  logoUrl: string;
}

/**
 * System item interface
 */
export interface SistemItem extends BaseEntity {
  logo: string;
  alamat: string;
  nama: string;
  logoUrl: string;
}

/**
 * OPD (Regional Office) item interface
 */
export interface OpdItem extends BaseEntity {
  nama: string;
  foto: string;
  website: string;
  alamat: string;
  fotoUrl: string;
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
