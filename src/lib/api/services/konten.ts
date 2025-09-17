import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateKontenRequest,
  Konten,
  KontenDetailResponse,
  KontenListResponse,
  KontenQueryParams,
  UpdateKontenRequest,
} from "@/lib/api/types/konten.types";

const base = "/api/kontens";

export const kontenService = createCrudService<Konten, KontenDetailResponse, CreateKontenRequest, UpdateKontenRequest>(
  base,
);

/**
 * Mendapatkan daftar konten dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar konten dengan pagination
 * @endpoint GET /api/kontens
 * @example
 * ```typescript
 * const response = await getKontens({ page: 1, per_page: 10, search: 'visi' });
 * console.log(response.data.data); // Array of konten
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getKontens = (params?: KontenQueryParams): Promise<ApiResponse<KontenListResponse>> => {
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

    return kontenService.get(finalParams);
  }

  return kontenService.get(params);
};

/**
 * Mendapatkan konten berdasarkan ID
 * @param id - ID konten
 * @returns Promise yang mengembalikan data konten
 * @endpoint GET /api/kontens/{id}
 * @example
 * ```typescript
 * const response = await getKontenById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getKontenById = (id: number): Promise<ApiResponse<KontenDetailResponse>> => kontenService.getById(id);

/**
 * Membuat konten baru
 * @param payload - Data untuk membuat konten baru
 * @returns Promise yang mengembalikan data konten yang dibuat
 * @endpoint POST /api/kontens
 * @example
 * ```typescript
 * const response = await createKonten({
 *   nama: 'Visi dan Misi',
 *   isi: '<h2>Visi</h2><p>Terwujudnya...',
 *   slug: 'visi-dan-misi',
 *   foto: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createKonten = (payload: CreateKontenRequest) => kontenService.create(payload);

/**
 * Memperbarui data konten
 * @param id - ID konten yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data konten yang diperbarui
 * @endpoint PUT /api/kontens/{id}
 * @example
 * ```typescript
 * const response = await updateKonten(123, {
 *   nama: 'Visi dan Misi Updated',
 *   isi: '<h2>Visi</h2><p>Terwujudnya...',
 *   slug: 'visi-dan-misi-updated'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateKonten = (id: number, payload: UpdateKontenRequest): Promise<ApiResponse<KontenDetailResponse>> =>
  kontenService.update(id, payload);

/**
 * Menghapus konten
 * @param id - ID konten yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/kontens/{id}
 * @example
 * ```typescript
 * await deleteKonten(123);
 * console.log('Konten berhasil dihapus');
 * ```
 */
export const deleteKonten = (id: number): Promise<ApiResponse<null>> => kontenService.remove(id);
