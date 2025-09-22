import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePerusdaRequest,
  Perusda,
  PerusdaDetailPublicResponse,
  PerusdaDetailResponse,
  PerusdaListPublicResponse,
  PerusdaListResponse,
  PerusdaQueryParams,
  UpdatePerusdaRequest,
} from "@/lib/api/types/perusda.types";

const base = "/api/perusdas";

export const perusdaService = createCrudService<Perusda, Perusda, CreatePerusdaRequest, UpdatePerusdaRequest>(base);

/**
 * Mendapatkan daftar perusda dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar perusda dengan pagination
 * @endpoint GET /api/perusdas
 * @example
 * ```typescript
 * const response = await getPerusdas({ page: 1, limit: 10, search: 'bank' });
 * console.log(response.data.data); // Array of perusda
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPerusdas = (params?: PerusdaQueryParams): Promise<ApiResponse<PerusdaListResponse>> => {
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

    return perusdaService.get(finalParams);
  }

  return perusdaService.get(params);
};

/**
 * Mendapatkan perusda berdasarkan ID
 * @param id - ID perusda
 * @returns Promise yang mengembalikan data perusda
 * @endpoint GET /api/perusdas/{id}
 * @example
 * ```typescript
 * const response = await getPerusdaById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getPerusdaById = (id: number): Promise<ApiResponse<PerusdaDetailResponse>> => perusdaService.getById(id);

/**
 * Membuat perusda baru
 * @param payload - Data untuk membuat perusda baru
 * @returns Promise yang mengembalikan data perusda yang dibuat
 * @endpoint POST /api/perusdas
 * @example
 * ```typescript
 * const response = await createPerusda({
 *   nama: 'PT Bank Daerah',
 *   alamat: 'Jl. Sudirman No. 1',
 *   telepon: '(0541) 123456',
 *   email: 'info@bankdaerah.co.id',
 *   foto: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPerusda = (payload: CreatePerusdaRequest) => perusdaService.create(payload);

/**
 * Memperbarui data perusda
 * @param id - ID perusda yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data perusda yang diperbarui
 * @endpoint PUT /api/perusdas/{id}
 * @example
 * ```typescript
 * const response = await updatePerusda(123, {
 *   nama: 'PT Bank Daerah Updated',
 *   alamat: 'Alamat baru...'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updatePerusda = (id: number, payload: UpdatePerusdaRequest): Promise<ApiResponse<Perusda>> =>
  perusdaService.update(id, payload);

/**
 * Menghapus perusda
 * @param id - ID perusda yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/perusdas/{id}
 * @example
 * ```typescript
 * await deletePerusda(123);
 * console.log('Perusda berhasil dihapus');
 * ```
 */
export const deletePerusda = (id: number): Promise<ApiResponse<null>> => perusdaService.remove(id);

/**
 * Mendapatkan daftar perusda untuk public display
 * @returns Promise yang mengembalikan daftar perusda public
 * @endpoint GET /perusda
 * @example
 * ```typescript
 * const response = await getPerusdaPublic();
 * console.log(response.data); // Array of Perusda
 * ```
 */
export const getPerusdaPublic = async (
  params?: PerusdaQueryParams,
): Promise<ApiResponse<PerusdaListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<PerusdaListPublicResponse>>("/perusda", { params });
  return data;
};

/**
 * Mendapatkan detail perusda berdasarkan ID untuk public display
 * @param id - ID perusda
 * @returns Promise yang mengembalikan detail perusda
 * @endpoint GET /perusda/{id}
 * @example
 * ```typescript
 * const response = await getPerusdaByIdPublic(123);
 * console.log(response.data.nama);
 * ```
 */
export const getPerusdaByIdPublic = async (id: number): Promise<ApiResponse<PerusdaDetailPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<PerusdaDetailPublicResponse>>(`/perusda/${id}`);
  return data;
};
