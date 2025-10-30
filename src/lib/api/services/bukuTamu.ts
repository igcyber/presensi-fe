import { httpInstance } from "@/lib/api/core";
import type { ApiResponse } from "@/lib/api/core";
import type {
  BukuTamuDetailResponse,
  BukuTamuListResponse,
  BukuTamuQueryParams,
  CreateBukuTamuPublicRequest,
  CreateBukuTamuRequest,
} from "@/lib/api/types/bukuTamu.types";

const BASE_URL = "/api/buku-tamu";

/**
 * Mendapatkan daftar buku tamu dengan pagination dan custom filters
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar buku tamu dengan pagination
 * @endpoint GET /api/buku-tamu
 * @example
 * ```typescript
 * const response = await getBukuTamus({ page: 1, limit: 10, search: 'perihal' });
 * console.log(response.data.data); // Array of buku tamu
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getBukuTamus = async (params?: BukuTamuQueryParams): Promise<ApiResponse<BukuTamuListResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<BukuTamuListResponse>>(BASE_URL, { params });
  return data;
};

/**
 * Mendapatkan buku tamu berdasarkan ID
 * @param id - ID dari buku tamu yang ingin diambil
 * @returns Promise yang mengembalikan buku tamu berdasarkan ID
 * @endpoint GET /api/buku-tamu/{id}
 * @example
 * ```typescript
 * const response = await getBukuTamuById(1);
 * console.log(response.data); // Buku tamu object
 * ```
 */
export const getBukuTamuById = async (id: number): Promise<ApiResponse<BukuTamuDetailResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<BukuTamuDetailResponse>>(`${BASE_URL}/${id}`);
  return data;
};

/**
 * Membuat buku tamu baru
 * @param payload - Data untuk membuat buku tamu baru
 * @returns Promise yang mengembalikan buku tamu baru
 * @endpoint POST /api/buku-tamu
 * @example
 * ```typescript
 * const response = await createBukuTamu({ judul: 'perihal' });
 * console.log(response.data); // Buku tamu object
 * ```
 */
export const createBukuTamu = async (payload: CreateBukuTamuRequest): Promise<ApiResponse<BukuTamuDetailResponse>> => {
  const { data } = await httpInstance.post<ApiResponse<BukuTamuDetailResponse>>(BASE_URL, payload);
  return data;
};

/**
 * Menghapus buku tamu berdasarkan ID
 * @param id - ID dari buku tamu yang ingin dihapus
 * @returns Promise yang mengembalikan hasil penghapusan buku tamu
 * @endpoint DELETE /api/buku-tamu/{id}
 * @example
 * ```typescript
 * const response = await deleteBukuTamu(1);
 * console.log(response.data); // { success: true }
 * ```
 */
export const deleteBukuTamu = async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
  const { data } = await httpInstance.delete<ApiResponse<{ success: boolean }>>(`${BASE_URL}/${id}`);
  return data;
};

/**
 * Mengubah status registered buku tamu berdasarkan ID
 * @param id - ID dari buku tamu yang ingin diubah status registered
 * @returns Promise yang mengembalikan hasil pengubahan status registered buku tamu
 * @endpoint POST /api/buku-tamu/{id}/toggle
 * @example
 * ```typescript
 * const response = await toggleRegistered(1);
 * console.log(response.data); // { success: true }
 * ```
 */
export const toggleRegistered = async (id: number): Promise<ApiResponse<BukuTamuDetailResponse>> => {
  const { data } = await httpInstance.post<ApiResponse<BukuTamuDetailResponse>>(`${BASE_URL}/${id}/toggle`);
  return data;
};

// ==================== Public Api ====================
/**
 * Mendapatkan buku tamu berdasarkan ID dan slug untuk public display
 * @param id - ID dari buku tamu yang ingin diambil
 * @param slug - Slug dari buku tamu yang ingin diambil
 * @param token - Token dari buku tamu yang ingin diambil
 * @returns Promise yang mengembalikan buku tamu berdasarkan ID dan slug
 * @endpoint GET /buku-tamu/{id}/{slug}
 * @example
 * ```typescript
 * const response = await getBukuTamuByIdPublic(1, 'slug', 'token');
 * console.log(response.data); // Buku tamu object
 * ```
 */
export const getBukuTamuByIdPublic = async (
  id: number,
  slug: string,
  token: string,
): Promise<ApiResponse<BukuTamuDetailResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<BukuTamuDetailResponse>>(`/buku-tamu/${id}/${slug}`, {
    params: {
      token,
    },
  });
  return data;
};

/**
 * Membuat buku tamu baru untuk public display
 * @param id - ID dari buku tamu yang ingin diisi
 * @param payload - Data untuk mengisi buku tamu
 * @param token - Token dari buku tamu yang ingin diisi
 * @returns Promise yang mengembalikan buku tamu yang telah diisi
 * @endpoint POST /buku-tamu/{id}/fill?token={token}
 * @example
 * ```typescript
 * const response = await createBukuTamuPublic({ nama: 'John Doe', nohp: '1234567890', asal: 'Jakarta', tujuan: 'Bandung', jumlah_tamu: 2, perihal: 'Perjalanan bisnis' });
 * console.log(response.data); // Buku tamu object
 * ```
 */
export const createBukuTamuPublic = async (
  id: number,
  payload: CreateBukuTamuPublicRequest,
  token: string,
): Promise<ApiResponse<BukuTamuDetailResponse>> => {
  const { data } = await httpInstance.post<ApiResponse<BukuTamuDetailResponse>>(`/buku-tamu/${id}/fill`, payload, {
    params: {
      token,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
