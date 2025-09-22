import type { ApiResponse, PayloadData } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type { FotoData, FotoListPayload } from "@/lib/api/types/media.types";

// ==================== FOTO SERVICES ====================

/**
 * Get paginated list of photos
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to foto list with pagination metadata
 * @endpoint GET /media/foto
 * @example
 * ```typescript
 * const response = await getFotos({ page: 1, keyword: 'pembangunan' });
 * console.log(response.data.fotos);
 * ```
 */
export const getFotos = async (page: number = 1): Promise<ApiResponse<FotoListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/media/foto?${queryString}` : "/media/foto";

  const response = await httpInstance.get<ApiResponse<FotoListPayload>>(url);
  return response.data;
};

/**
 * Get photo by ID
 * @param id - Photo ID
 * @returns Promise resolving to photo data
 * @endpoint GET /media/foto/{id}
 * @example
 * ```typescript
 * const response = await getFotoById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getFotoById = async (id: number): Promise<ApiResponse<PayloadData<FotoData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<FotoData>>>(`/media/foto/${id}`);
  return response.data;
};
