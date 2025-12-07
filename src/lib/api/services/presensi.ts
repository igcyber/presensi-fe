import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  PermohonanAdminItem,
  PermohonanAdminListResponse,
  PermohonanAdminParams,
  PermohonanItem,
  PermohonanListResponse,
  PermohonanParams,
  PermohonanPayload,
  PresensiPayload,
  PresensiResponseData,
  PresensiStatusResponse,
  RekapPresensiAdminParams,
  RekapPresensiAdminResponse,
  RekapPresensiParams,
  RekapPresensiResponse,
  RiwayatPresensiItem,
  RiwayatPresensiParams,
  VerifyPermohonanPayload,
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

/**
 * Get rekap presensi admin
 * @endpoint GET /api/admin/rekap-absen
 */
export const getRekapPresensiAdmin = async (
  params: RekapPresensiAdminParams,
): Promise<ApiResponse<RekapPresensiAdminResponse>> => {
  const response = await httpInstance.get<ApiResponse<RekapPresensiAdminResponse>>("/api/admin/rekap-absen", {
    params,
  });
  return response.data;
};

/**
 * Get Riwayat Absen Harian (Detail)
 * @endpoint GET /api/pegawai/riwayat-absen
 */
export const getRiwayatPresensi = async (
  params: RiwayatPresensiParams,
): Promise<ApiResponse<RiwayatPresensiItem[]>> => {
  const response = await httpInstance.get<ApiResponse<RiwayatPresensiItem[]>>(`${BASE_URL}/riwayat-absen`, {
    params,
  });
  return response.data;
};

/**
 * Get Daftar Permohonan (Tidak Hadir)
 * @endpoint GET /api/pegawai/pengajuan-tidak-hadir
 */
export const getPermohonanList = async (params?: PermohonanParams): Promise<ApiResponse<PermohonanListResponse>> => {
  const response = await httpInstance.get<ApiResponse<PermohonanListResponse>>(`${BASE_URL}/pengajuan-tidak-hadir`, {
    params,
  });
  return response.data;
};

/**
 * Cek Status Permohonan Hari Ini
 * @endpoint GET /api/pegawai/pengajuan-tidak-hadir/status-permohonan
 */
export const checkPermohonanStatus = async (): Promise<ApiResponse<PermohonanItem | null>> => {
  const response = await httpInstance.get<ApiResponse<PermohonanItem | null>>(
    `${BASE_URL}/pengajuan-tidak-hadir/status-permohonan`,
  );
  return response.data;
};

/**
 * Buat Pengajuan Baru
 * @endpoint POST /api/pegawai/pengajuan-tidak-hadir
 */
export const createPermohonan = async (payload: PermohonanPayload): Promise<ApiResponse<PermohonanItem>> => {
  const formData = new FormData();
  formData.append("tipe", payload.tipe);
  formData.append("tanggal_pengajuan", payload.tanggal_pengajuan);
  formData.append("keterangan_pengajuan", payload.keterangan_pengajuan);
  formData.append("file_pendukung", payload.file_pendukung);

  const response = await httpInstance.post<ApiResponse<PermohonanItem>>(`${BASE_URL}/pengajuan-tidak-hadir`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Get Daftar Permohonan Admin
 * @endpoint GET /api/admin/permohonan
 */
export const getPermohonanAdminList = async (
  params?: PermohonanAdminParams,
): Promise<ApiResponse<PermohonanAdminListResponse>> => {
  const response = await httpInstance.get<ApiResponse<PermohonanAdminListResponse>>("/api/admin/permohonan", {
    params,
  });
  return response.data;
};

/**
 * Verify Permohonan
 * @endpoint POST /api/admin/permohonan/:id/verify
 */
export const verifyPermohonan = async (
  id: number,
  payload: VerifyPermohonanPayload,
): Promise<ApiResponse<PermohonanAdminItem>> => {
  const response = await httpInstance.post<ApiResponse<PermohonanAdminItem>>(
    `/api/admin/permohonan/${id}/verify`,
    payload,
  );
  return response.data;
};
