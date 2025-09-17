import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  Bupati,
  BupatiDetailResponse,
  BupatiListResponse,
  BupatiQueryParams,
  CreateBupatiRequest,
  UpdateBupatiRequest,
} from "@/lib/api/types/bupati.types";

const base = "/api/bupatis";

export const bupatiService = createCrudService<Bupati, Bupati, CreateBupatiRequest, UpdateBupatiRequest>(base);

/**
 * Mendapatkan daftar bupati dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar bupati dengan pagination
 * @endpoint GET /api/bupatis
 * @example
 * ```typescript
 * const response = await getBupatis({ page: 1, limit: 10, search: 'edi' });
 * console.log(response.data.data); // Array of bupati
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getBupatis = (params?: BupatiQueryParams): Promise<ApiResponse<BupatiListResponse>> => {
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

    return bupatiService.get(finalParams);
  }

  return bupatiService.get(params);
};

/**
 * Mendapatkan bupati berdasarkan ID
 * @param id - ID bupati
 * @returns Promise yang mengembalikan data bupati
 * @endpoint GET /api/bupatis/{id}
 * @example
 * ```typescript
 * const response = await getBupatiById(123);
 * console.log(response.data.namaBupati);
 * ```
 */
export const getBupatiById = (id: number): Promise<ApiResponse<BupatiDetailResponse>> => bupatiService.getById(id);

/**
 * Membuat bupati baru
 * @param payload - Data untuk membuat bupati baru
 * @returns Promise yang mengembalikan data bupati yang dibuat
 * @endpoint POST /api/bupatis
 * @example
 * ```typescript
 * const response = await createBupati({
 *   namaBupati: 'Dr. H. Edi Damansyah',
 *   namaWakil: 'H. Rendi Solihin',
 *   tahunAwal: 2021,
 *   tahunAkhir: 2024,
 *   foto: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createBupati = (payload: CreateBupatiRequest) => bupatiService.create(payload);

/**
 * Memperbarui data bupati
 * @param id - ID bupati yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data bupati yang diperbarui
 * @endpoint PUT /api/bupatis/{id}
 * @example
 * ```typescript
 * const response = await updateBupati(123, {
 *   namaBupati: 'Dr. H. Edi Damansyah, S.H., M.H.',
 *   tahunAkhir: 2025
 * });
 * console.log(response.data.namaBupati);
 * ```
 */
export const updateBupati = (id: number, payload: UpdateBupatiRequest): Promise<ApiResponse<Bupati>> =>
  bupatiService.update(id, payload);

/**
 * Menghapus bupati
 * @param id - ID bupati yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/bupatis/{id}
 * @example
 * ```typescript
 * await deleteBupati(123);
 * console.log('Bupati berhasil dihapus');
 * ```
 */
export const deleteBupati = (id: number): Promise<ApiResponse<null>> => bupatiService.remove(id);
