import type { ApiResponse, SearchParams } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateJenisUsahaRequest,
  JenisUsaha,
  JenisUsahaDetail,
  JenisUsahaListResponse,
  JenisUsahaQueryParams,
  UpdateJenisUsahaRequest,
} from "@/lib/api/types/usaha.types";

const base = "/api/usaha";

export const usahaService = createCrudService<
  JenisUsaha,
  JenisUsahaDetail,
  CreateJenisUsahaRequest,
  UpdateJenisUsahaRequest
>(base);

/**
 * Mendapatkan daftar jenis usaha dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar jenis usaha dengan pagination
 * @endpoint GET /api/usaha
 * @example
 * ```typescript
 * const response = await getJenisUsahas({ page: 1, perPage: 10, search: 'Kosmetik' });
 * console.log(response.data.data); // Array of jenis usaha
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getJenisUsahas = (
  params?: SearchParams | JenisUsahaQueryParams,
): Promise<ApiResponse<JenisUsahaListResponse>> => {
  // Convert SearchParams (limit) to JenisUsahaQueryParams (perPage)
  const queryParams: Record<string, any> = {};

  if (params) {
    queryParams.page = params.page;

    if (params.search) {
      queryParams.search = params.search;
    }

    // Convert limit to perPage for API
    if ("limit" in params && params.limit) {
      queryParams.perPage = params.limit;
    } else if ("perPage" in params && params.perPage) {
      queryParams.perPage = params.perPage;
    } else if ("per_page" in params && params.per_page) {
      queryParams.perPage = params.per_page;
    }

    // Handle sort
    if (params.sort) {
      const [field, order] = params.sort.split(":");
      queryParams.sort_by = field;
      queryParams.sort_order = order || "asc";
    } else if ("sort_by" in params && params.sort_by) {
      queryParams.sort_by = params.sort_by;
      queryParams.sort_order = params.sort_order || "asc";
    }
  }

  return usahaService.get(queryParams);
};

/**
 * Mendapatkan jenis usaha berdasarkan ID
 * @param id - ID jenis usaha
 * @returns Promise yang mengembalikan data jenis usaha
 * @endpoint GET /api/usaha/{id}
 * @example
 * ```typescript
 * const response = await getJenisUsahaById(1);
 * console.log(response.data.nama);
 * ```
 */
export const getJenisUsahaById = (id: number): Promise<ApiResponse<JenisUsahaDetail>> => usahaService.getById(id);

/**
 * Membuat jenis usaha baru
 * @param payload - Data untuk membuat jenis usaha baru
 * @returns Promise yang mengembalikan data jenis usaha yang dibuat
 * @endpoint POST /api/usaha
 * @example
 * ```typescript
 * const response = await createJenisUsaha({
 *   nama: 'Kosmetik',
 *   warna: '#FF69B4'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createJenisUsaha = (payload: CreateJenisUsahaRequest) => usahaService.create(payload);

/**
 * Memperbarui data jenis usaha
 * @param id - ID jenis usaha yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data jenis usaha yang diperbarui
 * @endpoint PUT /api/usaha/{id}
 * @example
 * ```typescript
 * const response = await updateJenisUsaha(1, {
 *   nama: 'Kosmetik Updated',
 *   warna: '#FF69B4'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateJenisUsaha = (
  id: number,
  payload: UpdateJenisUsahaRequest,
): Promise<ApiResponse<JenisUsahaDetail>> => usahaService.update(id, payload);

/**
 * Menghapus jenis usaha
 * @param id - ID jenis usaha yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/usaha/{id}
 * @example
 * ```typescript
 * await deleteJenisUsaha(1);
 * console.log('Jenis usaha berhasil dihapus');
 * ```
 */
export const deleteJenisUsaha = (id: number): Promise<ApiResponse<null>> => usahaService.remove(id);
