import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateKategoriDokumenRequest,
  KategoriDokumen,
  KategoriDokumenDetailResponse,
  KategoriDokumenListResponse,
  KategoriDokumenQueryParams,
  UpdateKategoriDokumenRequest,
} from "@/lib/api/types/kategoriDokumen.types";

const base = "/api/kategori-dokumen";

export const kategoriDokumenService = createCrudService<
  KategoriDokumen,
  KategoriDokumen,
  CreateKategoriDokumenRequest,
  UpdateKategoriDokumenRequest
>(base);

/**
 * Mendapatkan daftar kategori dokumen dengan pagination dan custom filters
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar kategori dokumen dengan pagination
 * @endpoint GET /api/kategori-dokumen
 * @example
 * ```typescript
 * const response = await getKategoriDokumens({ page: 1, per_page: 10, search: 'peraturan' });
 * console.log(response.data.data); // Array of kategori dokumen
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getKategoriDokumens = (
  params?: KategoriDokumenQueryParams,
): Promise<ApiResponse<KategoriDokumenListResponse>> => {
  return kategoriDokumenService.get(params);
};

/**
 * Mendapatkan kategori dokumen berdasarkan ID
 * @param id - ID kategori dokumen
 * @returns Promise yang mengembalikan data kategori dokumen
 * @endpoint GET /api/kategori-dokumen/{id}
 * @example
 * ```typescript
 * const response = await getKategoriDokumenById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getKategoriDokumenById = (id: number): Promise<ApiResponse<KategoriDokumenDetailResponse>> =>
  kategoriDokumenService.getById(id);

/**
 * Membuat kategori dokumen baru
 * @param payload - Data untuk membuat kategori dokumen baru
 * @returns Promise yang mengembalikan data kategori dokumen yang dibuat
 * @endpoint POST /api/kategori-dokumen
 * @example
 * ```typescript
 * const response = await createKategoriDokumen({
 *   nama: 'Peraturan Daerah'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createKategoriDokumen = (payload: CreateKategoriDokumenRequest) => kategoriDokumenService.create(payload);

/**
 * Memperbarui data kategori dokumen
 * @param id - ID kategori dokumen yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data kategori dokumen yang diperbarui
 * @endpoint PUT /api/kategori-dokumen/{id}
 * @example
 * ```typescript
 * const response = await updateKategoriDokumen(123, {
 *   nama: 'Peraturan Daerah (Updated)'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateKategoriDokumen = (id: number, payload: UpdateKategoriDokumenRequest): Promise<ApiResponse<KategoriDokumen>> =>
  kategoriDokumenService.update(id, payload);

/**
 * Menghapus kategori dokumen
 * @param id - ID kategori dokumen yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/kategori-dokumen/{id}
 * @example
 * ```await deleteKategoriDokumen(123);
 * console.log('Kategori dokumen berhasil dihapus');
 * ```
 */
export const deleteKategoriDokumen = (id: number): Promise<ApiResponse<null>> => kategoriDokumenService.remove(id);
