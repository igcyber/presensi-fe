import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type { BerandaData } from "@/lib/api/types/beranda.types";

// Re-export types for convenience
export type {
  BerandaData,
  EmergencyItem,
  BannerItem,
  LayananItem,
  SistemItem,
  NewsItem,
  OpdItem,
  VideoItem,
} from "@/lib/api/types/beranda.types";

/**
 * Get homepage data including emergencies, news, banners, videos, services, systems, and OPDs
 * @returns Promise resolving to complete homepage data
 * @endpoint GET /beranda
 * @example
 * ```typescript
 * const response = await getBeranda();
 * console.log(response.data.berita);
 * console.log(response.data.emergencies);
 * ```
 */
export const getBeranda = async (): Promise<ApiResponse<BerandaData>> => {
  const response = await httpInstance.get<ApiResponse<BerandaData>>("/beranda");
  return response.data;
};
