import type { BaseEntity, PaginationMeta } from "@/lib/api/core/apiResponse";

/**
 * Foto/Photo data interface
 */
export interface FotoData extends BaseEntity {
  judul: string;
  foto: string;
  description?: string;
  category?: string;
  tags?: string[];
}

/**
 * List payload interfaces
 */
export interface FotoListPayload {
  fotos: FotoData[];
  meta?: PaginationMeta;
}

/**
 * Media search parameters
 */
export interface MediaSearchParams {
  page?: number;
  keyword?: string;
  category?: string;
  type?: "foto";
  sort?: "latest" | "popular" | "name";
}
