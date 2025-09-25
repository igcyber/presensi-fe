import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  AplikasiTerkait,
  AplikasiTerkaitDetailResponse,
  AplikasiTerkaitListResponse,
  AplikasiTerkaitQueryParams,
  CreateAplikasiTerkaitRequest,
  UpdateAplikasiTerkaitRequest,
} from "@/lib/api/types/aplikasiTerkait.types";

const base = "/api/aplikasi";

export const aplikasiTerkaitService = createCrudService<
  AplikasiTerkait,
  AplikasiTerkaitDetailResponse,
  CreateAplikasiTerkaitRequest,
  UpdateAplikasiTerkaitRequest
>(base);

/**
 * Mendapatkan daftar aplikasi terkait dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar aplikasi terkait dengan pagination
 * @endpoint GET /api/aplikasi-terkait
 * @example
 * ```typescript
 * const response = await getAplikasiTerkait({ page: 1, per_page: 10, search: 'e-Samsat' });
 * console.log(response.data.data); // Array of aplikasi terkait
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getAplikasiTerkait = (
  params?: AplikasiTerkaitQueryParams,
): Promise<ApiResponse<AplikasiTerkaitListResponse>> => {
  return aplikasiTerkaitService.get(params);
};

/**
 * Mendapatkan aplikasi terkait berdasarkan ID
 * @param id - ID aplikasi terkait
 * @returns Promise yang mengembalikan data aplikasi terkait
 * @endpoint GET /api/aplikasi-terkait/{id}
 * @example
 * ```typescript
 * const response = await getAplikasiTerkaitById(123);
 * console.log(response.data.text);
 * ```
 */
export const getAplikasiTerkaitById = (id: number): Promise<ApiResponse<AplikasiTerkaitDetailResponse>> =>
  aplikasiTerkaitService.getById(id);

/**
 * Membuat aplikasi terkait baru
 * @param payload - Data untuk membuat aplikasi terkait baru
 * @returns Promise yang mengembalikan data aplikasi terkait yang dibuat
 * @endpoint POST /api/aplikasi-terkait
 * @example
 * ```typescript
 * const response = await createAplikasiTerkait({
 *   cover: 'e-samsat.png',
 *   text: 'e-Samsat',
 *   link: 'https://samsat.id/'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createAplikasiTerkait = (payload: CreateAplikasiTerkaitRequest) => aplikasiTerkaitService.create(payload);

/**
 * Memperbarui data aplikasi terkait
 * @param id - ID aplikasi terkait yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data aplikasi terkait yang diperbarui
 * @endpoint PUT /api/aplikasi-terkait/{id}
 * @example
 * ```typescript
 * const response = await updateAplikasiTerkait(123, {
 *   text: 'e-Samsat Updated',
 *   link: 'https://samsat.id/'
 * });
 * console.log(response.data.text);
 * ```
 */
export const updateAplikasiTerkait = (
  id: number,
  payload: UpdateAplikasiTerkaitRequest,
): Promise<ApiResponse<AplikasiTerkaitDetailResponse>> => aplikasiTerkaitService.update(id, payload);

/**
 * Menghapus aplikasi terkait
 * @param id - ID aplikasi terkait yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/aplikasi-terkait/{id}
 * @example
 * ```typescript
 * await deleteAplikasiTerkait(123);
 * console.log('Aplikasi terkait berhasil dihapus');
 * ```
 */
export const deleteAplikasiTerkait = (id: number): Promise<ApiResponse<null>> => aplikasiTerkaitService.remove(id);
