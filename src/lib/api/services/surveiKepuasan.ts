import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  SurveiKepuasan,
  SurveiKepuasanDetailResponse,
  SurveiKepuasanListResponse,
  SurveiKepuasanQueryParams,
  SurveyStatusResponse,
} from "@/lib/api/types/surveiKepuasan.types";

const base = "/api/surveys";

export const surveiKepuasanService = createCrudService<
  SurveiKepuasan,
  SurveiKepuasanDetailResponse,
  never, // No create request
  never // No update request
>(base);

/**
 * Mendapatkan daftar survei kepuasan masyarakat dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar survei kepuasan dengan pagination
 * @endpoint GET /api/surveys
 * @example
 * ```typescript
 * const response = await getSurveiKepuasan({ page: 1, per_page: 10, search: 'Indra' });
 * console.log(response.data.data); // Array of survei kepuasan
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getSurveiKepuasan = (
  params?: SurveiKepuasanQueryParams,
): Promise<ApiResponse<SurveiKepuasanListResponse>> => {
  // Destructure customFilters jika ada
  if (params?.customFilters && params.customFilters.length > 0) {
    const { customFilters, ...restParams } = params;

    // Gabungkan semua properti dari customFilters ke dalam params utama
    const flattenedCustomFilters = customFilters.reduce((acc, filter) => {
      return { ...acc, ...filter };
    }, {});

    const finalParams = {
      ...restParams,
      ...flattenedCustomFilters,
    };

    return surveiKepuasanService.get(finalParams);
  }
  return surveiKepuasanService.get(params);
};

/**
 * Mendapatkan survei kepuasan berdasarkan ID
 * @param id - ID survei kepuasan
 * @returns Promise yang mengembalikan data survei kepuasan
 * @endpoint GET /api/surveys/{id}
 * @example
 * ```typescript
 * const response = await getSurveiKepuasanById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getSurveiKepuasanById = (id: number): Promise<ApiResponse<SurveiKepuasanDetailResponse>> =>
  surveiKepuasanService.getById(id);

/**
 * Mendapatkan status survei dan daftar pertanyaan
 * @returns Promise yang mengembalikan status survei dan daftar pertanyaan
 * @endpoint GET /api/surveys/status
 * @example
 * ```typescript
 * const response = await getSurveyStatus();
 * console.log(response.data.data.userInfo.data); // Array of survey questions
 * ```
 */
export const getSurveyStatus = async (): Promise<ApiResponse<SurveyStatusResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<SurveyStatusResponse>>("/api/surveys/status");
  return data;
};
