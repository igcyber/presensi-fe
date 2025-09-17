import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePrestasiRequest,
  Prestasi,
  PrestasiDetailResponse,
  PrestasiListResponse,
  PrestasiQueryParams,
  UpdatePrestasiRequest,
} from "@/lib/api/types/prestasi.types";

const base = "/api/prestasis";

export const prestasiService = createCrudService<Prestasi, Prestasi, CreatePrestasiRequest, UpdatePrestasiRequest>(
  base,
);

/**
 * Mendapatkan daftar prestasi dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar prestasi dengan pagination
 * @endpoint GET /api/prestasis
 * @example
 * ```typescript
 * const response = await getPrestasis({ page: 1, limit: 10, search: 'nasional' });
 * console.log(response.data.data); // Array of prestasi
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPrestasis = (params?: PrestasiQueryParams): Promise<ApiResponse<PrestasiListResponse>> => {
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

    return prestasiService.get(finalParams);
  }

  return prestasiService.get(params);
};

/**
 * Mendapatkan prestasi berdasarkan ID
 * @param id - ID prestasi
 * @returns Promise yang mengembalikan data prestasi
 * @endpoint GET /api/prestasis/{id}
 * @example
 * ```typescript
 * const response = await getPrestasiById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getPrestasiById = (id: number): Promise<ApiResponse<PrestasiDetailResponse>> =>
  prestasiService.getById(id);

/**
 * Membuat prestasi baru
 * @param payload - Data untuk membuat prestasi baru
 * @returns Promise yang mengembalikan data prestasi yang dibuat
 * @endpoint POST /api/prestasis
 * @example
 * ```typescript
 * const response = await createPrestasi({
 *   tahun: '2024',
 *   judul: 'Prestasi Terbaru',
 *   tingkat: 'Nasional',
 *   nama: 'Juara 1 Lomba Inovasi',
 *   keterangan: 'Prestasi di bidang teknologi...'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPrestasi = (payload: CreatePrestasiRequest) => prestasiService.create(payload);

/**
 * Memperbarui data prestasi
 * @param id - ID prestasi yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data prestasi yang diperbarui
 * @endpoint PUT /api/prestasis/{id}
 * @example
 * ```typescript
 * const response = await updatePrestasi(123, {
 *   judul: 'Prestasi Updated',
 *   keterangan: 'Keterangan yang diperbarui...'
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updatePrestasi = (id: number, payload: UpdatePrestasiRequest): Promise<ApiResponse<Prestasi>> =>
  prestasiService.update(id, payload);

/**
 * Menghapus prestasi
 * @param id - ID prestasi yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/prestasis/{id}
 * @example
 * ```typescript
 * await deletePrestasi(123);
 * console.log('Prestasi berhasil dihapus');
 * ```
 */
export const deletePrestasi = (id: number): Promise<ApiResponse<null>> => prestasiService.remove(id);
