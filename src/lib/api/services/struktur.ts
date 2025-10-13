import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateStrukturRequest,
  Struktur,
  StrukturDetailResponse,
  StrukturListResponse,
  StrukturQueryParams,
  UpdateStrukturRequest,
} from "@/lib/api/types/struktur.types";

import { httpInstance } from "../core";

const base = "/api/strukturs";

export const strukturService = createCrudService<
  Struktur,
  StrukturDetailResponse,
  CreateStrukturRequest,
  UpdateStrukturRequest
>(base);

/**
 * Mendapatkan daftar struktur dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar struktur dengan pagination
 * @endpoint GET /api/struktur
 * @example
 * ```typescript
 * const response = await getStrukturs({ page: 1, per_page: 10, search: 'komisi' });
 * console.log(response.data.data); // Array of struktur
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getStrukturs = (params?: StrukturQueryParams): Promise<ApiResponse<StrukturListResponse>> => {
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

    return strukturService.get(finalParams);
  }
  return strukturService.get(params);
};

/**
 * Mendapatkan struktur berdasarkan ID
 * @param id - ID struktur
 * @returns Promise yang mengembalikan data struktur
 * @endpoint GET /api/struktur/{id}
 * @example
 * ```typescript
 * const response = await getStrukturById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getStrukturById = (id: number): Promise<ApiResponse<StrukturDetailResponse>> =>
  strukturService.getById(id);

/**
 * Membuat struktur baru
 * @param payload - Data untuk membuat struktur baru
 * @returns Promise yang mengembalikan data struktur yang dibuat
 * @endpoint POST /api/struktur
 * @example
 * ```typescript
 * const response = await createStruktur({
 *   nama: 'Komisi I',
 *   tentang: 'Komisi I membidangi pemerintahan...',
 *   strukturId: 1
 * });
 * console.log(response.data.id);
 * ```
 */
export const createStruktur = (payload: CreateStrukturRequest) => strukturService.create(payload);

/**
 * Memperbarui data struktur
 * @param id - ID struktur yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data struktur yang diperbarui
 * @endpoint PUT /api/struktur/{id}
 * @example
 * ```typescript
 * const response = await updateStruktur(123, {
 *   nama: 'Komisi I (Updated)',
 *   tentang: 'Deskripsi yang diperbarui'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateStruktur = (
  id: number,
  payload: UpdateStrukturRequest,
): Promise<ApiResponse<StrukturDetailResponse>> => strukturService.update(id, payload);

/**
 * Menghapus struktur
 * @param id - ID struktur yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/struktur/{id}
 * @example
 * ```typescript
 * await deleteStruktur(123);
 * console.log('Struktur berhasil dihapus');
 * ```
 */
export const deleteStruktur = (id: number): Promise<ApiResponse<null>> => strukturService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar struktur untuk public display
 * @returns Promise yang mengembalikan daftar struktur public dengan children dan jabatanAnggota
 * @endpoint GET /struktur
 * @example
 * ```typescript
 * const response = await getStrukturPublic();
 * console.log(response.data); // Array of Struktur dengan nested data
 * ```
 */
export const getStrukturPublic = async (): Promise<ApiResponse<Struktur[]>> => {
  const { data } = await httpInstance.get<ApiResponse<Struktur[]>>(`/struktur`);
  return data;
};
