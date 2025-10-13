import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateStandarPelayananRequest,
  StandarPelayanan,
  StandarPelayananDetailResponse,
  StandarPelayananListResponse,
  StandarPelayananQueryParams,
  UpdateStandarPelayananRequest,
} from "@/lib/api/types/standarPelayanan.types";

import { httpInstance } from "../core";

const base = "/api/pelayanan";

export const standarPelayananService = createCrudService<
  StandarPelayanan,
  StandarPelayananDetailResponse,
  CreateStandarPelayananRequest,
  UpdateStandarPelayananRequest
>(base);

/**
 * Mendapatkan daftar standar pelayanan dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar standar pelayanan dengan pagination
 * @endpoint GET /api/pelayanan
 * @example
 * ```typescript
 * const response = await getStandarPelayanans({ page: 1, limit: 10, search: 'informasi' });
 * console.log(response.data.data); // Array of standar pelayanan
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getStandarPelayanans = (
  params?: StandarPelayananQueryParams,
): Promise<ApiResponse<StandarPelayananListResponse>> => standarPelayananService.get(params);

/**
 * Mendapatkan standar pelayanan berdasarkan ID
 * @param id - ID standar pelayanan
 * @returns Promise yang mengembalikan data standar pelayanan
 * @endpoint GET /api/pelayanan/{id}
 * @example
 * ```typescript
 * const response = await getStandarPelayananById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getStandarPelayananById = (id: number): Promise<ApiResponse<StandarPelayananDetailResponse>> =>
  standarPelayananService.getById(id);

/**
 * Membuat standar pelayanan baru
 * @param payload - Data untuk membuat standar pelayanan baru
 * @returns Promise yang mengembalikan data standar pelayanan yang dibuat
 * @endpoint POST /api/pelayanan
 * @example
 * ```typescript
 * const response = await createStandarPelayanan({
 *   nama: 'Pelayanan Informasi Publik',
 *   deskripsi: 'Standar pelayanan informasi...'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createStandarPelayanan = (payload: CreateStandarPelayananRequest) =>
  standarPelayananService.create(payload);

/**
 * Memperbarui data standar pelayanan
 * @param id - ID standar pelayanan yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data standar pelayanan yang diperbarui
 * @endpoint PUT /api/pelayanan/{id}
 * @example
 * ```typescript
 * const response = await updateStandarPelayanan(123, {
 *   nama: 'Pelayanan Informasi Publik (Updated)',
 *   deskripsi: 'Standar pelayanan informasi - Updated'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateStandarPelayanan = (
  id: number,
  payload: UpdateStandarPelayananRequest,
): Promise<ApiResponse<StandarPelayananDetailResponse>> => standarPelayananService.update(id, payload);

/**
 * Menghapus standar pelayanan
 * @param id - ID standar pelayanan yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/pelayanan/{id}
 * @example
 * ```typescript
 * await deleteStandarPelayanan(123);
 * console.log('Standar pelayanan berhasil dihapus');
 * ```
 */
export const deleteStandarPelayanan = (id: number): Promise<ApiResponse<null>> => standarPelayananService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar standar pelayanan untuk public display
 * @returns Promise yang mengembalikan daftar standar pelayanan public
 * @endpoint GET /api/pelayanan
 * @example
 * ```typescript
 * const response = await getStandarPelayananPublic();
 * console.log(response.data); // Array of standar pelayanan
 * ```
 */
export const getStandarPelayananPublic = async (
  params?: StandarPelayananQueryParams,
): Promise<ApiResponse<StandarPelayananListResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<StandarPelayananListResponse>>(`/standar-pelayanan`, { params });
  return data;
};
