import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateStatikRequest,
  Statik,
  StatikDetailResponse,
  StatikListResponse,
  StatikQueryParams,
  UpdateStatikRequest,
} from "@/lib/api/types/statik.types";

const base = "/api/statics";

export const statikService = createCrudService<Statik, StatikDetailResponse, CreateStatikRequest, UpdateStatikRequest>(
  base,
);

/**
 * Mendapatkan daftar statik dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar statik dengan pagination
 * @endpoint GET /api/statics
 * @example
 * ```typescript
 * const response = await getStatiks({ page: 1, per_page: 10, search: 'banner' });
 * console.log(response.data.data); // Array of statik
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getStatiks = (params?: StatikQueryParams): Promise<ApiResponse<StatikListResponse>> => {
  return statikService.get(params);
};

/**
 * Mendapatkan statik berdasarkan ID
 * @param id - ID statik
 * @returns Promise yang mengembalikan data statik
 * @endpoint GET /api/statics/{id}
 * @example
 * ```typescript
 * const response = await getStatikById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getStatikById = (id: number): Promise<ApiResponse<StatikDetailResponse>> => statikService.getById(id);

/**
 * Membuat statik baru
 * @param payload - Data untuk membuat statik baru
 * @returns Promise yang mengembalikan data statik yang dibuat
 * @endpoint POST /api/statics
 * @example
 * ```typescript
 * const response = await createStatik({
 *   nama: 'Banner Portal',
 *   jenis: 'video',
 *   isiFile: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createStatik = (payload: CreateStatikRequest) => statikService.create(payload);

/**
 * Memperbarui data statik
 * @param id - ID statik yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data statik yang diperbarui
 * @endpoint PUT /api/statics/{id}
 * @example
 * ```typescript
 * const response = await updateStatik(123, {
 *   nama: 'Banner Portal Updated',
 *   jenis: 'file',
 *   isiText: 'Updated content'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateStatik = (id: number, payload: UpdateStatikRequest): Promise<ApiResponse<StatikDetailResponse>> =>
  statikService.update(id, payload);

/**
 * Menghapus statik
 * @param id - ID statik yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/statics/{id}
 * @example
 * ```typescript
 * await deleteStatik(123);
 * console.log('Statik berhasil dihapus');
 * ```
 */
export const deleteStatik = (id: number): Promise<ApiResponse<null>> => statikService.remove(id);
