import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  KuesionerListResponse,
  LayananSurveiListResponse,
  SubmitSurveiRequest,
  SubmitSurveiResponse,
  SurveiQueryParams,
} from "@/lib/api/types/survei.types";

/**
 * Mendapatkan daftar layanan survei
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar layanan survei
 * @endpoint GET /api/surveys/layanan
 */
export const getLayananSurvei = async (params?: SurveiQueryParams): Promise<ApiResponse<LayananSurveiListResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<LayananSurveiListResponse>>(`/surveys/layanan`, { params });
  return data;
};

/**
 * Mendapatkan daftar kuesioner survei
 * @returns Promise yang mengembalikan daftar kuesioner
 * @endpoint GET /api/surveys/kuesioner
 */
export const getKuesionerSurvei = async (): Promise<ApiResponse<KuesionerListResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<KuesionerListResponse>>(`/surveys/kuesioner`);
  return data;
};

/**
 * Submit survei kepuasan masyarakat
 * @param payload - Data survei yang akan disubmit
 * @returns Promise yang mengembalikan response submit survei
 * @endpoint POST /api/surveys/submit
 */
export const submitSurveiKepuasan = async (
  payload: SubmitSurveiRequest,
): Promise<ApiResponse<SubmitSurveiResponse>> => {
  const { data } = await httpInstance.post<ApiResponse<SubmitSurveiResponse>>(`/surveys/submit`, payload);
  return data;
};
