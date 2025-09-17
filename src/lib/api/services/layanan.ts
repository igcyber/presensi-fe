import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateLayananRequest,
  Layanan,
  LayananDetailResponse,
  LayananListResponse,
  LayananQueryParams,
  UpdateLayananRequest,
} from "@/lib/api/types/layanan.types";

const base = "/api/layanans";

export const layananService = createCrudService<Layanan, Layanan, CreateLayananRequest, UpdateLayananRequest>(base);

/**
 * Mendapatkan daftar layanan dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar layanan dengan pagination
 * @endpoint GET /api/layanans
 * @example
 * ```typescript
 * const response = await getLayanans({ page: 1, limit: 10, search: 'digital' });
 * console.log(response.data.data); // Array of layanan
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getLayanans = (params?: LayananQueryParams): Promise<ApiResponse<LayananListResponse>> => {
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

    return layananService.get(finalParams);
  }

  return layananService.get(params);
};

/**
 * Mendapatkan layanan berdasarkan ID
 * @param id - ID layanan
 * @returns Promise yang mengembalikan data layanan
 * @endpoint GET /api/layanans/{id}
 * @example
 * ```typescript
 * const response = await getLayananById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getLayananById = (id: number): Promise<ApiResponse<LayananDetailResponse>> => layananService.getById(id);

/**
 * Membuat layanan baru
 * @param payload - Data untuk membuat layanan baru
 * @returns Promise yang mengembalikan data layanan yang dibuat
 * @endpoint POST /api/layanans
 * @example
 * ```typescript
 * const response = await createLayanan({
 *   nama: 'Layanan Digital',
 *   jenis: 'Layanan Online',
 *   opdId: 1,
 *   alamat: 'Kantor Diskominfo',
 *   keterangan: 'Layanan untuk...',
 *   logo: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createLayanan = (payload: CreateLayananRequest) => layananService.create(payload);

/**
 * Memperbarui data layanan
 * @param id - ID layanan yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data layanan yang diperbarui
 * @endpoint PUT /api/layanans/{id}
 * @example
 * ```typescript
 * const response = await updateLayanan(123, {
 *   nama: 'Layanan Digital Updated',
 *   keterangan: 'Keterangan yang diperbarui...'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateLayanan = (id: number, payload: UpdateLayananRequest): Promise<ApiResponse<Layanan>> =>
  layananService.update(id, payload);

/**
 * Menghapus layanan
 * @param id - ID layanan yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/layanans/{id}
 * @example
 * ```typescript
 * await deleteLayanan(123);
 * console.log('Layanan berhasil dihapus');
 * ```
 */
export const deleteLayanan = (id: number): Promise<ApiResponse<null>> => layananService.remove(id);
