import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateInfografisRequest,
  Infografis,
  InfografisDetailResponse,
  InfografisListPublicResponse,
  InfografisListResponse,
  InfografisQueryParams,
  UpdateInfografisRequest,
} from "@/lib/api/types/infografis.types";

const base = "/api/infografis";

export const infografisService = createCrudService<
  Infografis,
  InfografisDetailResponse,
  CreateInfografisRequest,
  UpdateInfografisRequest
>(base);

/**
 * Mendapatkan daftar infografis dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar infografis dengan pagination
 * @endpoint GET /api/infografis
 * @example
 * ```typescript
 * const response = await getInfografis({ page: 1, per_page: 10, search: 'kinerja' });
 * console.log(response.data.data); // Array of infografis
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getInfografis = (params?: InfografisQueryParams): Promise<ApiResponse<InfografisListResponse>> => {
  return infografisService.get(params);
};

/**
 * Mendapatkan infografis berdasarkan ID
 * @param id - ID infografis
 * @returns Promise yang mengembalikan data infografis
 * @endpoint GET /api/infografis/{id}
 * @example
 * ```typescript
 * const response = await getInfografisById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getInfografisById = (id: number): Promise<ApiResponse<InfografisDetailResponse>> =>
  infografisService.getById(id);

/**
 * Membuat infografis baru
 * @param payload - Data untuk membuat infografis baru
 * @returns Promise yang mengembalikan data infografis yang dibuat
 * @endpoint POST /api/infografis
 * @example
 * ```typescript
 * const response = await createInfografis({
 *   nama: 'Infografis Kinerja DPRD 2024',
 *   url: 'https://dprd.kukarkab.go.id/infografis/kinerja-2024',
 *   status: '1',
 *   isi: 'Infografis kinerja...',
 *   foto: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createInfografis = (payload: CreateInfografisRequest) => infografisService.create(payload);

/**
 * Memperbarui data infografis
 * @param id - ID infografis yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data infografis yang diperbarui
 * @endpoint PUT /api/infografis/{id}
 * @example
 * ```typescript
 * const response = await updateInfografis(123, {
 *   nama: 'Infografis Kinerja DPRD 2024 Updated',
 *   status: '1',
 *   foto: file
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateInfografis = (
  id: number,
  payload: UpdateInfografisRequest,
): Promise<ApiResponse<InfografisDetailResponse>> => infografisService.update(id, payload);

/**
 * Menghapus infografis
 * @param id - ID infografis yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/infografis/{id}
 * @example
 * ```typescript
 * await deleteInfografis(123);
 * console.log('Infografis berhasil dihapus');
 * ```
 */
export const deleteInfografis = (id: number): Promise<ApiResponse<null>> => infografisService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar infografis untuk public display
 * @returns Promise yang mengembalikan daftar infografis public
 * @endpoint GET /media/infografis
 * @example
 * ```typescript
 * const response = await getInfografisPublic();
 * console.log(response.data); // Array of InfografisPublic
 * ```
 */
export const getInfografisPublic = async (
  params?: InfografisQueryParams,
): Promise<ApiResponse<InfografisListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<InfografisListPublicResponse>>("/media/infografis", { params });
  return data;
};
