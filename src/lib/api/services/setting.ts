import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type { FaceIdStatus, UpdateFaceIdResponse } from "@/lib/api/types/setting.types";

/**
 * Cek status Face ID pegawai
 * @endpoint GET /api/setting/profile/check-face-id
 */
export const checkFaceIdStatus = async (): Promise<ApiResponse<FaceIdStatus>> => {
  const response = await httpInstance.get<ApiResponse<FaceIdStatus>>("/api/setting/profile/check-face-id");
  return response.data;
};

/**
 * Upload/Update foto wajah untuk Face ID
 * @param file - File foto wajah
 * @endpoint POST /api/setting/profile/face-id
 */
export const updateFaceId = async (file: File): Promise<ApiResponse<UpdateFaceIdResponse>> => {
  const formData = new FormData();
  formData.append("image", file); // Key 'image' sesuai dengan backend presensi-api

  const response = await httpInstance.post<ApiResponse<UpdateFaceIdResponse>>(
    "/api/setting/profile/face-id",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
