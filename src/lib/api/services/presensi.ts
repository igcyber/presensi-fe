import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  PresensiPayload,
  PresensiResponseData,
  PresensiStatusResponse,
  RekapPresensiParams,
  RekapPresensiResponse,
} from "@/lib/api/types/presensi.types";

const BASE_URL = "/api/pegawai";

/**
 * Get status presensi hari ini
 * @endpoint GET /api/pegawai/absen
 */
export const getPresensiToday = async (): Promise<ApiResponse<PresensiStatusResponse>> => {
  const response = await httpInstance.get<ApiResponse<PresensiStatusResponse>>(`${BASE_URL}/absen`);
  return response.data;
};

/**
 * Kirim data presensi (Masuk/Pulang)
 * @endpoint POST /api/pegawai/absen
 */
export const submitPresensi = async (payload: PresensiPayload): Promise<ApiResponse<PresensiResponseData>> => {
  const formData = new FormData();
  formData.append("tipe", payload.tipe);
  formData.append("lat", payload.lat);
  formData.append("long", payload.long);
  formData.append("jarak", payload.jarak.toString());
  formData.append("image", payload.image);

  const response = await httpInstance.post<ApiResponse<PresensiResponseData>>(`${BASE_URL}/absen`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Get rekap presensi
 * @endpoint GET /api/pegawai/rekap-absen
 */
export const getRekapPresensi = async (params: RekapPresensiParams): Promise<ApiResponse<RekapPresensiResponse>> => {
  const response = await httpInstance.get<ApiResponse<RekapPresensiResponse>>(`${BASE_URL}/rekap-absen`, {
    params,
  });
  return response.data;
};
