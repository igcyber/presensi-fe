import type { ApiResponse, SearchParams } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateKiosRequest,
  Kios,
  KiosDetail,
  KiosListResponse,
  KiosQueryParams,
  UpdateKiosRequest,
} from "@/lib/api/types/kios.types";

const base = "/api/kios";

export const kiosService = createCrudService<Kios, KiosDetail, CreateKiosRequest, UpdateKiosRequest>(base);

/**
 * Mendapatkan daftar kios dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar kios dengan pagination
 * @endpoint GET /api/kios
 * @example
 * ```typescript
 * const response = await getKioses({ page: 1, perPage: 10, search: '313' });
 * console.log(response.data.data); // Array of kios
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getKioses = (params?: SearchParams | KiosQueryParams): Promise<ApiResponse<KiosListResponse>> => {
  // Convert SearchParams (limit) to KiosQueryParams (perPage)
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

  return kiosService.get(queryParams);
};

/**
 * Mendapatkan kios berdasarkan ID
 * @param id - ID kios
 * @returns Promise yang mengembalikan data kios
 * @endpoint GET /api/kios/{id}
 * @example
 * ```typescript
 * const response = await getKiosById(1);
 * console.log(response.data.kode);
 * ```
 */
export const getKiosById = (id: number): Promise<ApiResponse<KiosDetail>> => kiosService.getById(id);

/**
 * Membuat kios baru
 * @param payload - Data untuk membuat kios baru
 * @returns Promise yang mengembalikan data kios yang dibuat
 * @endpoint POST /api/kios
 * @example
 * ```typescript
 * const response = await createKios({
 *   kode: 'K461',
 *   jenisUsahaId: 1,
 *   pasarId: 1
 * });
 * console.log(response.data.id);
 * ```
 */
export const createKios = (payload: CreateKiosRequest) => kiosService.create(payload);

/**
 * Memperbarui data kios
 * @param id - ID kios yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data kios yang diperbarui
 * @endpoint PUT /api/kios/{id}
 * @example
 * ```typescript
 * const response = await updateKios(1, {
 *   kode: 'K462',
 *   jenisUsahaId: 2,
 *   pasarId: 1
 * });
 * console.log(response.data.kode);
 * ```
 */
export const updateKios = (id: number, payload: UpdateKiosRequest): Promise<ApiResponse<KiosDetail>> =>
  kiosService.update(id, payload);

/**
 * Menghapus kios
 * @param id - ID kios yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/kios/{id}
 * @example
 * ```typescript
 * await deleteKios(1);
 * console.log('Kios berhasil dihapus');
 * ```
 */
export const deleteKios = (id: number): Promise<ApiResponse<null>> => kiosService.remove(id);

