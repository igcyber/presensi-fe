import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateOpdRequest,
  Opd,
  OpdDetailPublicResponse,
  OpdDetailResponse,
  OpdListPublicResponse,
  OpdListResponse,
  OpdQueryParams,
  UpdateOpdRequest,
} from "@/lib/api/types/opd.types";

import httpInstance from "../core/httpInstance";

const base = "/api/opds";

export const opdService = createCrudService<Opd, OpdDetailResponse, CreateOpdRequest, UpdateOpdRequest>(base);

/**
 * Mendapatkan daftar OPD dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar OPD dengan pagination
 * @endpoint GET /api/opds
 * @example
 * ```typescript
 * const response = await getOpds({ page: 1, per_page: 10, search: 'dinas' });
 * console.log(response.data.data); // Array of OPD
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getOpds = (params?: OpdQueryParams): Promise<ApiResponse<OpdListResponse>> => opdService.get(params);

/**
 * Mendapatkan OPD berdasarkan ID
 * @param id - ID OPD
 * @returns Promise yang mengembalikan data OPD
 * @endpoint GET /api/opds/{id}
 * @example
 * ```typescript
 * const response = await getOpdById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getOpdById = (id: number): Promise<ApiResponse<OpdDetailResponse>> => opdService.getById(id);

/**
 * Membuat OPD baru
 * @param payload - Data untuk membuat OPD baru
 * @returns Promise yang mengembalikan data OPD yang dibuat
 * @endpoint POST /api/opds
 * @example
 * ```typescript
 * const response = await createOpd({
 *   nama: 'Dinas Pendidikan',
 *   alamat: 'Jl. Sudirman No. 1',
 *   maps: 'https://maps.google.com/...',
 *   keterangan: 'Dinas yang menangani pendidikan',
 *   foto: 'foto.jpg',
 *   website: 'https://disdik.example.com'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createOpd = (payload: CreateOpdRequest) => opdService.create(payload);

/**
 * Memperbarui data OPD
 * @param id - ID OPD yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data OPD yang diperbarui
 * @endpoint PUT /api/opds/{id}
 * @example
 * ```typescript
 * const response = await updateOpd(123, {
 *   nama: 'Dinas Pendidikan Updated',
 *   alamat: 'Jl. Sudirman No. 2',
 *   website: 'https://disdik-updated.example.com'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateOpd = (id: number, payload: UpdateOpdRequest): Promise<ApiResponse<OpdDetailResponse>> =>
  opdService.update(id, payload);

/**
 * Menghapus OPD
 * @param id - ID OPD yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/opds/{id}
 * @example
 * ```typescript
 * await deleteOpd(123);
 * console.log('OPD berhasil dihapus');
 * ```
 */
export const deleteOpd = (id: number): Promise<ApiResponse<null>> => opdService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar OPD untuk public display
 * @returns Promise yang mengembalikan daftar OPD public
 * @endpoint GET /opds
 * @example
 * ```typescript
 * const response = await getOpdPublic();
 * console.log(response.data); // Array of Opd
 * ```
 */
export const getOpdPublic = async (params?: OpdQueryParams): Promise<ApiResponse<OpdListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<OpdListPublicResponse>>("/opds", { params });
  return data;
};

/**
 * Mendapatkan detail OPD berdasarkan ID untuk tampilan publik
 * @param id - ID OPD yang akan diambil
 * @returns Promise yang mengembalikan detail data OPD
 * @endpoint GET /opds/{id}
 * @example
 * ```typescript
 * const response = await getOpdByIdPublic(123);
 * console.log(response.data); // Detail OPD
 * ```
 */
export const getOpdByIdPublic = async (id: number): Promise<ApiResponse<OpdDetailPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<OpdDetailPublicResponse>>(`/opds/${id}`);
  return data;
};
