import { httpInstance } from "@/lib/api/core";
import type { ApiResponse } from "@/lib/api/core";
import type {
  CreateTindakLanjutRequest,
  TindakLanjutDetailResponse,
  TindakLanjutListResponse,
  TindakLanjutQueryParams,
  UpdateTindakLanjutRequest,
} from "@/lib/api/types/tindakLanjut.types";

const BASE_URL = "/api/tindak-lanjut";

/**
 * Mendapatkan daftar tindak lanjut dengan pagination dan custom filters
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar tindak lanjut dengan pagination
 * @endpoint GET /api/tindak-lanjut
 * @example
 * ```typescript
 * const response = await getTindakLanjuts({ pengaduanId: 1, page: 1, limit: 10 });
 * console.log(response.data.data); // Array of tindak lanjut
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getTindakLanjuts = async (
  params?: TindakLanjutQueryParams,
): Promise<ApiResponse<TindakLanjutListResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<TindakLanjutListResponse>>(BASE_URL, { params });
  return data;
};

/**
 * Mendapatkan tindak lanjut berdasarkan ID
 * @param id - ID dari tindak lanjut yang ingin diambil
 * @returns Promise yang mengembalikan tindak lanjut berdasarkan ID
 * @endpoint GET /api/tindak-lanjut/{id}
 * @example
 * ```typescript
 * const response = await getTindakLanjutById(1);
 * console.log(response.data); // Tindak lanjut object
 * ```
 */
export const getTindakLanjutById = async (id: number): Promise<ApiResponse<TindakLanjutDetailResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<TindakLanjutDetailResponse>>(`${BASE_URL}/${id}`);
  return data;
};

/**
 * Membuat tindak lanjut baru
 * @param payload - Data untuk membuat tindak lanjut baru
 * @returns Promise yang mengembalikan tindak lanjut baru
 * @endpoint POST /api/tindak-lanjut
 * @example
 * ```typescript
 * const response = await createTindakLanjut({
 *   pengaduanId: 1,
 *   tanggalMulai: '2025-01-01',
 *   deskripsi: 'Tindak lanjut telah dilaksanakan'
 * });
 * console.log(response.data); // Tindak lanjut object
 * ```
 */
export const createTindakLanjut = async (
  payload: CreateTindakLanjutRequest,
): Promise<ApiResponse<TindakLanjutDetailResponse>> => {
  // Convert to FormData for file upload support
  const formData = new FormData();

  formData.append("pengaduanId", payload.pengaduanId.toString());
  formData.append("tanggalMulai", payload.tanggalMulai);
  if (payload.tanggalTindakLanjut) {
    formData.append("tanggalTindakLanjut", payload.tanggalTindakLanjut);
  }
  formData.append("deskripsi", payload.deskripsi);
  if (payload.dokumenDukung) {
    formData.append("dokumenDukung", payload.dokumenDukung);
  }

  const { data } = await httpInstance.post<ApiResponse<TindakLanjutDetailResponse>>(BASE_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

/**
 * Update tindak lanjut berdasarkan ID
 * @param id - ID dari tindak lanjut yang ingin diupdate
 * @param payload - Data untuk update tindak lanjut
 * @returns Promise yang mengembalikan tindak lanjut yang diupdate
 * @endpoint PUT /api/tindak-lanjut/{id}
 * @example
 * ```typescript
 * const response = await updateTindakLanjut(1, {
 *   deskripsi: 'Tindak lanjut telah diperbarui'
 * });
 * console.log(response.data); // Tindak lanjut object
 * ```
 */
export const updateTindakLanjut = async (
  id: number,
  payload: UpdateTindakLanjutRequest,
): Promise<ApiResponse<TindakLanjutDetailResponse>> => {
  // Convert to FormData for file upload support
  const formData = new FormData();

  if (payload.tanggalMulai) {
    formData.append("tanggalMulai", payload.tanggalMulai);
  }
  if (payload.tanggalTindakLanjut) {
    formData.append("tanggalTindakLanjut", payload.tanggalTindakLanjut);
  }
  if (payload.deskripsi) {
    formData.append("deskripsi", payload.deskripsi);
  }
  if (payload.dokumenDukung) {
    formData.append("dokumenDukung", payload.dokumenDukung);
  }

  const { data } = await httpInstance.put<ApiResponse<TindakLanjutDetailResponse>>(`${BASE_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

/**
 * Menghapus tindak lanjut berdasarkan ID
 * @param id - ID dari tindak lanjut yang ingin dihapus
 * @returns Promise yang mengembalikan hasil penghapusan tindak lanjut
 * @endpoint DELETE /api/tindak-lanjut/{id}
 * @example
 * ```typescript
 * const response = await deleteTindakLanjut(1);
 * console.log(response.data); // { success: true }
 * ```
 */
export const deleteTindakLanjut = async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
  const { data } = await httpInstance.delete<ApiResponse<{ success: boolean }>>(`${BASE_URL}/${id}`);
  return data;
};
