import type { ApiResponse, SearchParams } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePasarRequest,
  Pasar,
  PasarDetail,
  PasarListResponse,
  PasarQueryParams,
  UpdatePasarRequest,
} from "@/lib/api/types/pasar.types";

const base = "/api/pasar";

export const pasarService = createCrudService<Pasar, PasarDetail, CreatePasarRequest, UpdatePasarRequest>(base);

/**
 * Mendapatkan daftar pasar dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar pasar dengan pagination
 * @endpoint GET /api/pasar
 * @example
 * ```typescript
 * const response = await getPasars({ page: 1, perPage: 10, search: 'Tangga Arung' });
 * console.log(response.data.data); // Array of pasar
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPasars = (params?: SearchParams | PasarQueryParams): Promise<ApiResponse<PasarListResponse>> => {
  // Convert SearchParams (limit) to PasarQueryParams (perPage)
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

  return pasarService.get(queryParams);
};

/**
 * Mendapatkan pasar berdasarkan ID
 * @param id - ID pasar
 * @returns Promise yang mengembalikan data pasar
 * @endpoint GET /api/pasar/{id}
 * @example
 * ```typescript
 * const response = await getPasarById(1);
 * console.log(response.data.nama);
 * ```
 */
export const getPasarById = (id: number): Promise<ApiResponse<PasarDetail>> => pasarService.getById(id);

/**
 * Membuat pasar baru
 * @param payload - Data untuk membuat pasar baru
 * @returns Promise yang mengembalikan data pasar yang dibuat
 * @endpoint POST /api/pasar
 * @example
 * ```typescript
 * const response = await createPasar({
 *   nama: 'Pasar Tangga Arung',
 *   jenisPasar: 'Tradisional'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPasar = (payload: CreatePasarRequest) => pasarService.create(payload);

/**
 * Memperbarui data pasar
 * @param id - ID pasar yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data pasar yang diperbarui
 * @endpoint PUT /api/pasar/{id}
 * @example
 * ```typescript
 * const response = await updatePasar(1, {
 *   nama: 'Pasar Tangga Arung Updated',
 *   jenisPasar: 'Modern'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updatePasar = (id: number, payload: UpdatePasarRequest): Promise<ApiResponse<PasarDetail>> =>
  pasarService.update(id, payload);

/**
 * Menghapus pasar
 * @param id - ID pasar yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/pasar/{id}
 * @example
 * ```typescript
 * await deletePasar(1);
 * console.log('Pasar berhasil dihapus');
 * ```
 */
export const deletePasar = (id: number): Promise<ApiResponse<null>> => pasarService.remove(id);

