import { httpInstance } from "@/lib/api/core";
import type { ApiResponse, SearchParams } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePedagangKiosRequest,
  CreatePedagangRequest,
  Pedagang,
  PedagangDetail,
  PedagangKios,
  PedagangListResponse,
  PedagangQueryParams,
  UpdatePedagangRequest,
} from "@/lib/api/types/pedagang.types";

const base = "/api/pedagang";

export const pedagangService = createCrudService<
  Pedagang,
  PedagangDetail,
  CreatePedagangRequest,
  UpdatePedagangRequest
>(base);

/**
 * Mendapatkan daftar pedagang dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar pedagang dengan pagination
 * @endpoint GET /api/pedagang
 * @example
 * ```typescript
 * const response = await getPedagangs({ page: 1, perPage: 10, search: 'Abdul' });
 * console.log(response.data.data); // Array of pedagang
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPedagangs = (
  params?: SearchParams | PedagangQueryParams,
): Promise<ApiResponse<PedagangListResponse>> => {
  // Convert SearchParams (limit) to PedagangQueryParams (perPage)
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

  return pedagangService.get(queryParams);
};

/**
 * Mendapatkan pedagang berdasarkan ID
 * @param id - ID pedagang
 * @returns Promise yang mengembalikan data pedagang
 * @endpoint GET /api/pedagang/{id}
 * @example
 * ```typescript
 * const response = await getPedagangById(1);
 * console.log(response.data.nama);
 * ```
 */
export const getPedagangById = (id: number): Promise<ApiResponse<PedagangDetail>> => pedagangService.getById(id);

/**
 * Membuat pedagang baru
 * @param payload - Data untuk membuat pedagang baru
 * @returns Promise yang mengembalikan data pedagang yang dibuat
 * @endpoint POST /api/pedagang
 * @example
 * ```typescript
 * const response = await createPedagang({
 *   nama: 'Abdul Gafar',
 *   nik: '6402063112790010',
 *   noKk: '6402060604110010',
 *   tempatLahir: 'Amuntai',
 *   tanggalLahir: '1979-12-31',
 *   alamat: 'Jl. Tirta Kencna 6, Rt. 44, Kel. Melayu'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPedagang = (payload: CreatePedagangRequest) => pedagangService.create(payload);

/**
 * Memperbarui data pedagang
 * @param id - ID pedagang yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data pedagang yang diperbarui
 * @endpoint PUT /api/pedagang/{id}
 * @example
 * ```typescript
 * const response = await updatePedagang(1, {
 *   nama: 'Abdul Gafar Updated',
 *   alamat: 'Alamat baru'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updatePedagang = (id: number, payload: UpdatePedagangRequest): Promise<ApiResponse<PedagangDetail>> =>
  pedagangService.update(id, payload);

/**
 * Menghapus pedagang
 * @param id - ID pedagang yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/pedagang/{id}
 * @example
 * ```typescript
 * await deletePedagang(1);
 * console.log('Pedagang berhasil dihapus');
 * ```
 */
export const deletePedagang = (id: number): Promise<ApiResponse<null>> => pedagangService.remove(id);

/**
 * Mendapatkan daftar kios yang ditetapkan ke pedagang
 * @param pedagangId - ID pedagang
 * @returns Promise yang mengembalikan daftar kios yang ditetapkan
 * @endpoint GET /api/pedagang/{pedagangId}/kios
 * @example
 * ```typescript
 * const response = await getPedagangKios(1);
 * console.log(response.data); // Array of PedagangKios
 * ```
 */
export const getPedagangKios = (pedagangId: number): Promise<ApiResponse<PedagangKios[]>> => {
  return httpInstance.get(`/api/pedagang/${pedagangId}/kios`).then((response) => response.data);
};

/**
 * Menetapkan kios ke pedagang
 * @param pedagangId - ID pedagang
 * @param payload - Data untuk menetapkan kios
 * @returns Promise yang mengembalikan data penetapan kios
 * @endpoint POST /api/pedagang/{pedagangId}/kios
 * @example
 * ```typescript
 * const response = await createPedagangKios(1, {
 *   kiosId: 1,
 *   isActive: true
 * });
 * console.log(response.data);
 * ```
 */
export const createPedagangKios = (
  pedagangId: number,
  payload: CreatePedagangKiosRequest,
): Promise<ApiResponse<PedagangKios>> => {
  return httpInstance.post(`/api/pedagang/${pedagangId}/kios`, payload).then((response) => response.data);
};

/**
 * Memperbarui status penetapan kios ke pedagang
 * @param pedagangId - ID pedagang
 * @param kiosId - ID kios (bukan ID relasi)
 * @param payload - Data untuk memperbarui penetapan kios
 * @returns Promise yang mengembalikan data penetapan kios yang diperbarui
 * @endpoint PUT /api/pedagang/{pedagangId}/kios/{kiosId}
 * @example
 * ```typescript
 * const response = await updatePedagangKios(1, 1, {
 *   isActive: false
 * });
 * console.log(response.data);
 * ```
 */
export const updatePedagangKios = (
  pedagangId: number,
  kiosId: number,
  payload: { isActive: boolean },
): Promise<ApiResponse<PedagangKios>> => {
  return httpInstance.put(`/api/pedagang/${pedagangId}/kios/${kiosId}`, payload).then((response) => response.data);
};

/**
 * Menghapus penetapan kios dari pedagang
 * @param pedagangId - ID pedagang
 * @param kiosId - ID kios (bukan ID relasi)
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/pedagang/{pedagangId}/kios/{kiosId}
 * @example
 * ```typescript
 * await deletePedagangKios(1, 1);
 * console.log('Penetapan kios berhasil dihapus');
 * ```
 */
export const deletePedagangKios = (pedagangId: number, kiosId: number): Promise<ApiResponse<null>> => {
  return httpInstance.delete(`/api/pedagang/${pedagangId}/kios/${kiosId}`).then((response) => response.data);
};
